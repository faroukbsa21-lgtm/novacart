<?php

namespace App\Controllers;

use App\Config\Security;
use App\Middleware\AuthMiddleware;
use App\Services\SupabaseClient;

class AdminController
{
    private SupabaseClient $supabase;

    public function __construct()
    {
        $this->supabase = new SupabaseClient();
    }

    /**
     * GET /api/admin/stats
     */
    public function stats(): void
    {
        AuthMiddleware::requireRole('admin');

        // Total Products
        $productsRes = $this->supabase->select('products', [], 'id', 1);
        $totalProducts = $productsRes['total'] ?? 0;

        // Total Orders and Revenue
        $ordersRes = $this->supabase->select('orders', [], 'total_amount, status');
        $totalOrders = 0;
        $totalRevenue = 0.0;
        if (!empty($ordersRes['data'])) {
            $totalOrders = count($ordersRes['data']);
            foreach ($ordersRes['data'] as $o) {
                if ($o['status'] !== 'cancelled') {
                    $totalRevenue += (float)$o['total_amount'];
                }
            }
        }

        // Total Users
        $usersRes = $this->supabase->select('profiles', [], 'id', 1);
        $totalUsers = $usersRes['total'] ?? 0;

        // Recent 5 Orders
        $recentOrders = $this->supabase->select('orders', [
            'order' => 'created_at.desc',
            'limit' => 5
        ], 'id, order_number, customer_name, customer_email, total_amount, status, created_at');

        Security::jsonResponse([
            'success' => true,
            'stats' => [
                'total_revenue' => round($totalRevenue, 2),
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_users' => $totalUsers
            ],
            'recent_orders' => $recentOrders['data'] ?? []
        ]);
    }

    /**
     * POST /api/admin/products
     */
    public function createProduct(): void
    {
        AuthMiddleware::requireRole('admin');
        $body = Security::getJsonInput();

        $title = Security::sanitizeString($body['title'] ?? '');
        $description = Security::sanitizeString($body['description'] ?? '');
        $price = (float)($body['price'] ?? 0);
        $compareAtPrice = isset($body['compare_at_price']) && is_numeric($body['compare_at_price']) ? (float)$body['compare_at_price'] : null;
        $stock = max(0, (int)($body['stock_quantity'] ?? 0));
        $categoryId = Security::sanitizeString($body['category_id'] ?? '');
        $images = is_array($body['images'] ?? null) ? $body['images'] : [];
        $isFeatured = !empty($body['is_featured']);

        if (empty($title) || $price <= 0) {
            Security::errorResponse('Title and a valid price (> 0) are required', 422);
        }

        // Generate URL-friendly slug
        $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        $slug = $baseSlug . '-' . substr(bin2hex(random_bytes(2)), 0, 4);

        $productData = [
            'title' => $title,
            'slug' => $slug,
            'description' => $description,
            'price' => $price,
            'compare_at_price' => $compareAtPrice,
            'stock_quantity' => $stock,
            'images' => $images,
            'is_featured' => $isFeatured,
            'is_active' => true
        ];

        if (Security::isValidUuid($categoryId)) {
            $productData['category_id'] = $categoryId;
        }

        $res = $this->supabase->insert('products', [$productData]);

        if (!$res['success']) {
            Security::errorResponse($res['error'] ?? 'Failed to create product', 500);
        }

        Security::jsonResponse([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $res['data'][0] ?? $productData
        ], 201);
    }

    /**
     * PUT /api/admin/products/{id}
     */
    public function updateProduct(string $id): void
    {
        AuthMiddleware::requireRole('admin');
        $cleanId = Security::sanitizeString($id);

        if (!Security::isValidUuid($cleanId)) {
            Security::errorResponse('Valid product UUID required', 400);
        }

        $body = Security::getJsonInput();
        $allowed = ['title', 'description', 'price', 'compare_at_price', 'stock_quantity', 'category_id', 'images', 'is_featured', 'is_active'];
        $updateData = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $body)) {
                if ($field === 'price' || $field === 'compare_at_price') {
                    $updateData[$field] = $body[$field] !== null ? (float)$body[$field] : null;
                } elseif ($field === 'stock_quantity') {
                    $updateData[$field] = max(0, (int)$body[$field]);
                } elseif ($field === 'is_featured' || $field === 'is_active') {
                    $updateData[$field] = (bool)$body[$field];
                } elseif ($field === 'images') {
                    $updateData[$field] = is_array($body[$field]) ? $body[$field] : [];
                } else {
                    $updateData[$field] = Security::sanitizeString($body[$field]);
                }
            }
        }

        $res = $this->supabase->update('products', ['id' => "eq.{$cleanId}"], $updateData);

        if (!$res['success']) {
            Security::errorResponse($res['error'] ?? 'Failed to update product', 500);
        }

        Security::jsonResponse([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $res['data'][0] ?? $updateData
        ]);
    }

    /**
     * DELETE /api/admin/products/{id}
     */
    public function deleteProduct(string $id): void
    {
        AuthMiddleware::requireRole('admin');
        $cleanId = Security::sanitizeString($id);

        if (!Security::isValidUuid($cleanId)) {
            Security::errorResponse('Valid product UUID required', 400);
        }

        $res = $this->supabase->delete('products', ['id' => "eq.{$cleanId}"]);

        if (!$res['success']) {
            Security::errorResponse($res['error'] ?? 'Failed to delete product', 500);
        }

        Security::jsonResponse([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * GET /api/admin/orders
     */
    public function orders(): void
    {
        AuthMiddleware::requireRole('admin');

        $params = ['order' => 'created_at.desc'];
        if (!empty($_GET['status'])) {
            $status = Security::sanitizeString($_GET['status']);
            $params['status'] = "eq.{$status}";
        }

        $res = $this->supabase->select('orders', $params, 'id, order_number, customer_name, customer_email, total_amount, status, payment_status, payment_method, created_at');

        Security::jsonResponse([
            'success' => true,
            'data' => $res['data'] ?? []
        ]);
    }

    /**
     * PATCH /api/admin/orders/{id}/status
     */
    public function updateOrderStatus(string $id): void
    {
        AuthMiddleware::requireRole('admin');
        $cleanId = Security::sanitizeString($id);

        if (!Security::isValidUuid($cleanId)) {
            Security::errorResponse('Valid order UUID required', 400);
        }

        $body = Security::getJsonInput();
        $status = Security::sanitizeString($body['status'] ?? '');

        $validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
        if (!in_array($status, $validStatuses, true)) {
            Security::errorResponse('Invalid order status value', 422);
        }

        $res = $this->supabase->update('orders', ['id' => "eq.{$cleanId}"], ['status' => $status]);

        if (!$res['success']) {
            Security::errorResponse($res['error'] ?? 'Failed to update order status', 500);
        }

        Security::jsonResponse([
            'success' => true,
            'message' => 'Order status updated successfully',
            'order' => $res['data'][0] ?? ['id' => $cleanId, 'status' => $status]
        ]);
    }

    /**
     * GET /api/admin/users
     * List all registered users
     */
    public function users(): void
    {
        AuthMiddleware::requireRole('admin');

        $res = $this->supabase->select('profiles', [
            'order' => 'created_at.desc'
        ], 'id, email, full_name, avatar_url, phone, role, created_at, is_active');

        Security::jsonResponse([
            'success' => true,
            'data' => $res['data'] ?? []
        ]);
    }

    /**
     * PATCH /api/admin/users/{id}/role
     * Change user role (e.g. customer, moderator / mod, admin)
     */
    public function updateUserRole(string $id): void
    {
        $adminUser = AuthMiddleware::requireRole('admin');
        $cleanId = Security::sanitizeString($id);

        if (!Security::isValidUuid($cleanId)) {
            Security::errorResponse('Valid user UUID required', 400);
        }

        $body = Security::getJsonInput();
        $inputRole = strtolower(trim(Security::sanitizeString($body['role'] ?? '')));

        // Map 'mod' to 'moderator' to conform to database constraint
        $roleMap = [
            'mod' => 'moderator',
            'moderator' => 'moderator',
            'admin' => 'admin',
            'customer' => 'customer'
        ];

        if (!isset($roleMap[$inputRole])) {
            Security::errorResponse("Invalid role. Permitted: 'customer', 'mod', 'moderator', 'admin'", 422);
        }

        $targetRole = $roleMap[$inputRole];

        // Prevent self-demotion from admin
        if ($adminUser['sub'] === $cleanId && $targetRole !== 'admin') {
            Security::errorResponse("You cannot remove your own admin role", 403);
        }

        $res = $this->supabase->update('profiles', ['id' => "eq.{$cleanId}"], [
            'role' => $targetRole,
            'updated_at' => date('Y-m-d H:i:s.uP')
        ]);

        if (!$res['success']) {
            Security::errorResponse($res['error'] ?? 'Failed to update user role in database', 500);
        }

        Security::jsonResponse([
            'success' => true,
            'message' => "Role updated to '{$targetRole}' successfully",
            'user' => $res['data'][0] ?? ['id' => $cleanId, 'role' => $targetRole]
        ]);
    }

    /**
     * DELETE /api/admin/users/{id}
     * Remove customer account
     */
    public function deleteUser(string $id): void
    {
        $adminUser = AuthMiddleware::requireRole('admin');
        $cleanId = Security::sanitizeString($id);

        if (!Security::isValidUuid($cleanId)) {
            Security::errorResponse('Valid user UUID required', 400);
        }

        // Prevent self-deletion
        if ($adminUser['sub'] === $cleanId) {
            Security::errorResponse("You cannot delete your own admin account", 403);
        }

        $res = $this->supabase->delete('profiles', ['id' => "eq.{$cleanId}"]);

        if (!$res['success']) {
            Security::errorResponse($res['error'] ?? 'Failed to delete user from database', 500);
        }

        Security::jsonResponse([
            'success' => true,
            'message' => 'Customer removed successfully'
        ]);
    }
}
