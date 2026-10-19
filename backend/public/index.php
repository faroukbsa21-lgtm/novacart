<?php

/**
 * ==============================================================================
 * ECOMSUPABASE HIGH-SECURITY PHP API ENTRY POINT
 * ==============================================================================
 */

declare(strict_types=1);

// PSR-4 compliant autoloader for pure PHP execution without composer dependency requirement
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

use App\Config\Env;
use App\Config\Security;
use App\Controllers\AuthController;
use App\Controllers\ProductController;
use App\Controllers\CategoryController;
use App\Controllers\OrderController;
use App\Controllers\ReviewController;
use App\Controllers\AdminController;
use App\Controllers\UploadController;

// Load environment configuration
Env::load(__DIR__ . '/../.env');

// Security Exception and Error Handler: Never leak database credentials or internal stack traces
set_exception_handler(function (Throwable $e) {
    error_log("Unhandled Exception: " . $e->getMessage() . "\n" . $e->getTraceAsString());
    
    if (Env::isProduction()) {
        Security::errorResponse("An internal server error occurred.", 500);
    } else {
        Security::errorResponse($e->getMessage(), 500, [
            'file' => basename($e->getFile()),
            'line' => $e->getLine()
        ]);
    }
});

// Set security headers and enforce CORS
Security::applySecurityHeaders();
Security::handleCors();

// Normalize URI path and HTTP Method
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$requestMethod = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Strip base subfolder if hosted in subdirectory or prefix
$path = preg_replace('#^/index\.php#', '', $requestUri);
$path = rtrim($path, '/');
if ($path === '') {
    $path = '/';
}

// -----------------------------------------------------------------------------
// ROUTER
// -----------------------------------------------------------------------------

// Root Endpoint
if ($path === '/') {
    Security::jsonResponse([
        'name' => 'NovaCart Secure API Gateway',
        'status' => 'operational',
        'health' => '/api/health',
        'timestamp' => date('c')
    ]);
}

// System Health Check
if ($path === '/health' || $path === '/api/health') {
    $supabase = new \App\Services\SupabaseClient();
    Security::jsonResponse([
        'status' => 'operational',
        'timestamp' => date('c'),
        'supabase_configured' => $supabase->isConfigured(),
        'app_env' => Env::get('APP_ENV', 'development'),
        'php_version' => PHP_VERSION
    ]);
}

// Authentication Routes
if ($requestMethod === 'POST' && $path === '/api/auth/register') {
    (new AuthController())->register();
}
if ($requestMethod === 'POST' && $path === '/api/auth/login') {
    (new AuthController())->login();
}
if ($requestMethod === 'GET' && $path === '/api/auth/me') {
    (new AuthController())->me();
}
if (($requestMethod === 'PUT' || $requestMethod === 'PATCH') && $path === '/api/auth/profile') {
    (new AuthController())->updateProfile();
}

// Category Routes
if ($requestMethod === 'GET' && $path === '/api/categories') {
    (new CategoryController())->index();
}
if ($requestMethod === 'GET' && preg_match('#^/api/categories/([^/]+)$#', $path, $matches)) {
    (new CategoryController())->show($matches[1]);
}

// Product Routes
if ($requestMethod === 'GET' && $path === '/api/products/featured') {
    (new ProductController())->featured();
}
if ($requestMethod === 'GET' && $path === '/api/products') {
    (new ProductController())->index();
}
if ($requestMethod === 'GET' && preg_match('#^/api/products/([^/]+)$#', $path, $matches)) {
    (new ProductController())->show($matches[1]);
}

// Order Routes
if ($requestMethod === 'POST' && $path === '/api/orders') {
    (new OrderController())->create();
}
if ($requestMethod === 'GET' && $path === '/api/orders/my-orders') {
    (new OrderController())->myOrders();
}
if ($requestMethod === 'GET' && preg_match('#^/api/orders/([^/]+)$#', $path, $matches)) {
    (new OrderController())->show($matches[1]);
}

// Review Routes
if ($requestMethod === 'GET' && $path === '/api/reviews') {
    (new ReviewController())->index();
}
if ($requestMethod === 'POST' && $path === '/api/reviews') {
    (new ReviewController())->create();
}

// Media Upload Route (Products & Avatars)
if ($requestMethod === 'POST' && $path === '/api/upload') {
    (new UploadController())->upload();
}

// Admin Routes (Role-Protected inside controller)
if ($requestMethod === 'GET' && $path === '/api/admin/stats') {
    (new AdminController())->stats();
}
if ($requestMethod === 'POST' && $path === '/api/admin/products') {
    (new AdminController())->createProduct();
}
if ($requestMethod === 'PUT' && preg_match('#^/api/admin/products/([^/]+)$#', $path, $matches)) {
    (new AdminController())->updateProduct($matches[1]);
}
if ($requestMethod === 'DELETE' && preg_match('#^/api/admin/products/([^/]+)$#', $path, $matches)) {
    (new AdminController())->deleteProduct($matches[1]);
}
if ($requestMethod === 'GET' && $path === '/api/admin/orders') {
    (new AdminController())->orders();
}
if ($requestMethod === 'PATCH' && preg_match('#^/api/admin/orders/([^/]+)/status$#', $path, $matches)) {
    (new AdminController())->updateOrderStatus($matches[1]);
}
if ($requestMethod === 'GET' && $path === '/api/admin/users') {
    (new AdminController())->users();
}
if ($requestMethod === 'PATCH' && preg_match('#^/api/admin/users/([^/]+)/role$#', $path, $matches)) {
    (new AdminController())->updateUserRole($matches[1]);
}
if ($requestMethod === 'DELETE' && preg_match('#^/api/admin/users/([^/]+)$#', $path, $matches)) {
    (new AdminController())->deleteUser($matches[1]);
}

// 404 Fallback
Security::errorResponse("Endpoint '{$requestMethod} {$path}' not found", 404);
