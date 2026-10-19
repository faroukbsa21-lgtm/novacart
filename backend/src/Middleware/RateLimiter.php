<?php

namespace App\Middleware;

use App\Config\Security;

class RateLimiter
{
    private static string $storageDir = '';

    /**
     * Initialize rate limit cache directory
     */
    private static function initStorage(): void
    {
        if (empty(self::$storageDir)) {
            self::$storageDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'ecom_rate_limits';
            if (!is_dir(self::$storageDir)) {
                @mkdir(self::$storageDir, 0700, true);
            }
        }
    }

    /**
     * Get client real IP address securely
     */
    public static function getClientIp(): string
    {
        // Check Cloudflare or reverse proxy headers if trusted
        $headers = [
            'HTTP_CF_CONNECTING_IP',
            'HTTP_X_REAL_IP',
            'HTTP_X_FORWARDED_FOR',
            'REMOTE_ADDR'
        ];

        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                $ip = trim($ips[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }

        return '127.0.0.1';
    }

    /**
     * Check and enforce rate limit
     * 
     * @param string $bucket Category of limit, e.g., 'auth', 'api', 'checkout'
     * @param int $maxRequests Allowed attempts within window
     * @param int $windowSeconds Time window in seconds (default 60s)
     */
    public static function check(string $bucket = 'api', int $maxRequests = 100, int $windowSeconds = 60): void
    {
        self::initStorage();
        $ip = self::getClientIp();
        $key = hash('sha256', "{$bucket}_{$ip}");
        $file = self::$storageDir . DIRECTORY_SEPARATOR . "rate_{$key}.json";

        $now = time();
        $records = [];

        if (file_exists($file)) {
            $content = @file_get_contents($file);
            $decoded = json_decode($content, true);
            if (is_array($decoded)) {
                // Keep only timestamps within current window
                $records = array_filter($decoded, fn($ts) => $ts > ($now - $windowSeconds));
            }
        }

        $currentCount = count($records);

        header("X-RateLimit-Limit: {$maxRequests}");
        header("X-RateLimit-Remaining: " . max(0, $maxRequests - $currentCount - 1));

        if ($currentCount >= $maxRequests) {
            $oldestTimestamp = min($records);
            $retryAfter = max(1, ($oldestTimestamp + $windowSeconds) - $now);
            header("Retry-After: {$retryAfter}");
            Security::errorResponse(
                "Too many requests. Rate limit exceeded. Please wait {$retryAfter} seconds before trying again.",
                429
            );
        }

        // Add current timestamp and save
        $records[] = $now;
        @file_put_contents($file, json_encode(array_values($records)), LOCK_EX);
    }
}
