<?php

namespace App\Controllers;

use App\Config\Security;
use App\Config\AlgeriaShipping;
use App\Middleware\AuthMiddleware;
use App\Middleware\RateLimiter;
use App\Services\SupabaseClient;

class OrderController
{
    private SupabaseClient $supabase;

    public function __construct()
    {
        $this->supabase = new SupabaseClient();
    }

    /**
     * POST /api/orders
     * High Security Checkout: Recalculates all pricing server-side, verifies stock, prevents tampering.
     */
    public function create(): void
    {
        RateLimiter::check('checkout', 10, 60);

        // Optional authentication (supports guest checkout or logged-in user)
        $user = AuthMiddleware::authenticate();
        $userId = $user['sub'] ?? null;

        $body = Security::getJsonInput();
        $items = $body['items'] ?? [];
        $shippingAddress = $body['shipping_address'] ?? null;
        $customerEmail = Security::sanitizeEmail($body['customer_email'] ?? ($user['email'] ?? null));
        $customerName = Security::sanitizeString($body['customer_name'] ?? ($user['name'] ?? ''));
        $paymentMethod = in_array($body['payment_method'] ?? '', ['card', 'cod', 'paypal', 'stripe', 'bank_transfer']) 
            ? $body['payment_method'] 
            : 'card';

        // Validation
        if (empty($items) || !is_array($items)) {
            Security::errorResponse('Your cart is empty. Please add items to checkout.', 400);
        }

        if (!$customerEmail) {
            Security::errorResponse('A valid customer email is required.', 422);
        }

        if (!Security::isTrustedEmailDomain($customerEmail, true)) {
            Security::errorResponse('For security reasons, only email addresses from recognized providers (Gmail, Outlook, Yahoo, Hotmail, iCloud, Proton) are accepted for order processing.', 422);
        }

        if (empty($customerName)) {
            Security::errorResponse('Customer name is required.', 422);
        }

        if (empty($shippingAddress) || !is_array($shippingAddress) || (empty($shippingAddress['street']) && empty($shippingAddress['desk_address'])) || empty($shippingAddress['city'])) {
            Security::errorResponse('Valid shipping address (street/desk location, city/commune) is required.', 422);
        }

        // Fetch product information securely from database to prevent price manipulation
        $productIds = [];
        $quantities = [];

        foreach ($items as $item) {
            $pId = $item['product_id'] ?? null;
            $qty = (int)($item['quantity'] ?? 0);

            if (!$pId || !Security::isValidUuid($pId) || $qty <= 0) {
                Security::errorResponse('Invalid item or quantity in order payload', 400);
            }

            $productIds[] = $pId;
            $quantities[$pId] = $qty;
        }

        // Fetch products in one batch
        $idsParam = 'in.(' . implode(',', $productIds) . ')';
        $productsRes = $this->supabase->select('products', ['id' => $idsParam], 'id, title, price, stock_quantity, images, is_active');

        if (!$productsRes['success'] || empty($productsRes['data'])) {
            Security::errorResponse('Products could not be verified in store database.', 400);
        }

        $serverProducts = [];
        foreach ($productsRes['data'] as $p) {
            $serverProducts[$p['id']] = $p;
        }

        // Calculate totals on server
        $calculatedSubtotal = 0.0;
        $orderItemsData = [];

        foreach ($quantities as $pId => $qty) {
            if (!isset($serverProducts[$pId])) {
                Security::errorResponse("Product ID {$pId} is unavailable.", 404);
            }

            $product = $serverProducts[$pId];

            if (empty($product['is_active'])) {
                Security::errorResponse("Product '{$product['title']}' is currently inactive.", 400);
            }

            if ($product['stock_quantity'] < $qty) {
                Security::errorResponse("Insufficient stock for '{$product['title']}'. Only {$product['stock_quantity']} available.", 400);
            }

            $unitPrice = (float)$product['price'];
            $lineTotal = round($unitPrice * $qty, 2);
            $calculatedSubtotal += $lineTotal;

            $images = is_array($product['images']) ? $product['images'] : json_decode($product['images'] ?? '[]', true);
            $firstImage = !empty($images[0]) ? $images[0] : null;

            $orderItemsData[] = [
                'product_id' => $pId,
                'product_title' => $product['title'],
                'product_image' => $firstImage,
                'unit_price' => $unitPrice,
                'quantity' => $qty,
                'total_price' => $lineTotal
            ];
        }

        $calculatedSubtotal = round($calculatedSubtotal, 2);

        // Resolve Algeria Wilaya (1-69) and Delivery Type (home vs desk)
        $wilayaCode = (int)($shippingAddress['wilaya_code'] ?? ($shippingAddress['state'] ?? 16));
        $deliveryType = ($shippingAddress['delivery_type'] ?? 'home') === 'desk' ? AlgeriaShipping::TYPE_DESK : AlgeriaShipping::TYPE_HOME;

        if (AlgeriaShipping::isValidWilayaCode($wilayaCode)) {
            $shippingInfo = AlgeriaShipping::calculateShippingFee($wilayaCode, $deliveryType);
            $shippingAmount = (float)$shippingInfo['dzd'];
            $shippingAddress['wilaya_code'] = $wilayaCode;
            $shippingAddress['wilaya_name'] = $shippingInfo['name'];
            $shippingAddress['wilaya_ar'] = $shippingInfo['ar'];
            $shippingAddress['delivery_type'] = $deliveryType;
            $shippingAddress['delivery_label'] = ($deliveryType === AlgeriaShipping::TYPE_DESK) 
                ? 'Livraison au Bureau (Stop Desk)' 
                : 'Livraison à Domicile';
            $shippingAddress['shipping_fee_dzd'] = $shippingInfo['dzd'];
            $shippingAddress['country'] = 'Algérie';
        } else {
            $shippingAmount = 600.0;
        }

        $taxRate = 0.05; // 5% standard sales tax
        $taxAmount = round($calculatedSubtotal * $taxRate, 2);
        $discountAmount = 0.0;
        $totalAmount = round($calculatedSubtotal + $shippingAmount + $taxAmount - $discountAmount, 2);

        // Generate crypto-secure Order Number
        $randomHex = strtoupper(bin2hex(random_bytes(3)));
        $orderNumber = 'ORD-' . date('Ymd') . '-' . $randomHex;

        // Create Order Record
        $orderPayload = [
            'order_number' => $orderNumber,
            'user_id' => $userId,
            'customer_email' => $customerEmail,
            'customer_name' => $customerName,
            'subtotal' => $calculatedSubtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'status' => 'processing',
            'payment_status' => ($paymentMethod === 'cod') ? 'pending' : 'paid',
            'payment_method' => $paymentMethod,
            'shipping_address' => $shippingAddress,
            'notes' => Security::sanitizeString($body['notes'] ?? '')
        ];

        $orderInsert = $this->supabase->insert('orders', [$orderPayload]);

        if (!$orderInsert['success'] || empty($orderInsert['data'])) {
            Security::errorResponse($orderInsert['error'] ?? 'Failed to place order in database.', 500);
        }

        $createdOrder = $orderInsert['data'][0];
        $orderId = $createdOrder['id'];

        // Insert Order Items
        foreach ($orderItemsData as &$itemRow) {
            $itemRow['order_id'] = $orderId;
        }

        $itemsInsert = $this->supabase->insert('order_items', $orderItemsData);

        // Decrement product stock in Supabase
        foreach ($quantities as $pId => $qty) {
            $newStock = max(0, $serverProducts[$pId]['stock_quantity'] - $qty);
            $this->supabase->update('products', ['id' => "eq.{$pId}"], [
                'stock_quantity' => $newStock
            ]);
        }

        $createdOrder['items'] = $itemsInsert['data'] ?? $orderItemsData;

        Security::jsonResponse([
            'success' => true,
            'message' => 'Order placed successfully!',
            'order' => $createdOrder
        ], 201);
    }

    /**
     * GET /api/orders/my-orders
     */
    public function myOrders(): void
    {
        $user = AuthMiddleware::requireAuth();
        $userId = $user['sub'];

        $orders = $this->supabase->select('orders', [
            'user_id' => "eq.{$userId}",
            'order' => 'created_at.desc'
        ], 'id, order_number, subtotal, tax_amount, shipping_amount, total_amount, status, payment_status, payment_method, shipping_address, created_at, items:order_items(id, product_title, product_image, unit_price, quantity, total_price)');

        Security::jsonResponse([
            'success' => true,
            'data' => $orders['data'] ?? []
        ]);
    }

    /**
     * GET /api/orders/{id}
     */
    public function show(string $orderId): void
    {
        $cleanId = Security::sanitizeString($orderId);
        $user = AuthMiddleware::authenticate();

        $filter = Security::isValidUuid($cleanId) 
            ? ['id' => "eq.{$cleanId}"] 
            : ['order_number' => "eq.{$cleanId}"];

        $orderRes = $this->supabase->select('orders', $filter, '*', 1);

        if (!$orderRes['success'] || empty($orderRes['data'])) {
            Security::errorResponse('Order not found', 404);
        }

        $order = $orderRes['data'][0];

        // Access control: only owner or admin can view order
        $isOwner = ($user && isset($user['sub']) && $order['user_id'] === $user['sub']);
        $isAdmin = ($user && isset($user['role']) && $user['role'] === 'admin');

        if (!$isOwner && !$isAdmin) {
            Security::errorResponse('Forbidden. You do not have permission to view this order.', 403);
        }

        // Fetch items
        $itemsRes = $this->supabase->select('order_items', [
            'order_id' => "eq.{$order['id']}"
        ]);
        $order['items'] = $itemsRes['data'] ?? [];

        Security::jsonResponse([
            'success' => true,
            'data' => $order
        ]);
    }
}
