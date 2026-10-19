<?php

namespace App\Middleware;

use App\Config\Security;

class AuthMiddleware
{
    private static ?array $user = null;

    /**
     * Get bearer token from Authorization header or apache request headers
     */
    public static function getBearerToken(): ?string
    {
        $headers = '';
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)),
                array_values($requestHeaders)
            );
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }

        if (!empty($headers) && preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Authenticate request and return user payload or null
     */
    public static function authenticate(): ?array
    {
        if (self::$user !== null) {
            return self::$user;
        }

        $token = self::getBearerToken();
        if (!$token) {
            return null;
        }

        $payload = Security::verifyJwt($token);
        if (!$payload) {
            return null;
        }

        self::$user = $payload;
        return self::$user;
    }

    /**
     * Require authentication or abort with 401
     */
    public static function requireAuth(): array
    {
        $user = self::authenticate();
        if (!$user) {
            Security::errorResponse("Unauthorized. Valid authentication token required.", 401);
        }
        return $user;
    }

    /**
     * Require specific role (e.g. 'admin') or abort with 403
     */
    public static function requireRole(string $requiredRole): array
    {
        $user = self::requireAuth();
        $userRole = $user['role'] ?? 'customer';

        if ($userRole !== $requiredRole) {
            Security::errorResponse("Forbidden. You do not have '{$requiredRole}' permissions.", 403);
        }

        return $user;
    }
}
