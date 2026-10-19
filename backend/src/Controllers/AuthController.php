<?php

namespace App\Controllers;

use App\Config\Security;
use App\Middleware\AuthMiddleware;
use App\Middleware\RateLimiter;
use App\Services\SupabaseClient;

class AuthController
{
    private SupabaseClient $supabase;

    public function __construct()
    {
        $this->supabase = new SupabaseClient();
    }

    /**
     * POST /api/auth/register
     */
    public function register(): void
    {
        // Enforce rate limiting: 5 attempts per minute
        RateLimiter::check('auth_register', 5, 60);

        $body = Security::getJsonInput();
        $email = Security::sanitizeEmail($body['email'] ?? null);
        $password = $body['password'] ?? '';
        $fullName = Security::sanitizeString($body['full_name'] ?? '');
        $preferredLanguage = strtolower(trim($body['preferred_language'] ?? 'ar'));
        if (!in_array($preferredLanguage, ['ar', 'en', 'fr'], true)) {
            $preferredLanguage = 'ar';
        }

        // Validation
        $errors = [];
        if (!$email) {
            $errors['email'] = 'A valid email address is required';
        } elseif (!Security::isTrustedEmailDomain($email)) {
            $errors['email'] = 'For security reasons, only email addresses from recognized providers (Gmail, Outlook, Yahoo, Hotmail, iCloud, Proton) are accepted.';
        }
        if (strlen($fullName) < 2) {
            $errors['full_name'] = 'Full name must be at least 2 characters';
        }
        if (strlen($password) < 8) {
            $errors['password'] = 'Password must be at least 8 characters long';
        } elseif (!preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
            $errors['password'] = 'Password must include at least one uppercase letter and one number';
        }

        if (!empty($errors)) {
            Security::errorResponse('Validation failed', 422, $errors);
        }

        // Check if user already exists
        $existing = $this->supabase->select('profiles', ['email' => "eq.{$email}"], 'id');
        if (!empty($existing['data'])) {
            Security::errorResponse('An account with this email address already exists', 409);
        }

        // Hash password securely with Bcrypt (cost 12)
        $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

        $initialAddress = [
            'street' => '',
            'city' => '',
            'state' => '',
            'postal_code' => '',
            'country' => 'Algérie',
            'preferred_language' => $preferredLanguage
        ];

        $userData = [
            'email' => $email,
            'password_hash' => $passwordHash,
            'full_name' => $fullName,
            'role' => 'customer',
            'is_active' => true,
            'address' => $initialAddress
        ];

        $insertResult = $this->supabase->insert('profiles', [$userData]);

        if (!$insertResult['success'] || empty($insertResult['data'])) {
            Security::errorResponse(
                $insertResult['error'] ?? 'Failed to create user account. Please check database setup.',
                500
            );
        }

        $createdUser = $insertResult['data'][0];
        unset($createdUser['password_hash']);
        $createdUser['preferred_language'] = $preferredLanguage;

        // Issue JWT token
        $token = Security::generateJwt([
            'sub' => $createdUser['id'],
            'email' => $createdUser['email'],
            'role' => $createdUser['role'],
            'name' => $createdUser['full_name']
        ]);

        Security::jsonResponse([
            'success' => true,
            'message' => 'Account created successfully',
            'token' => $token,
            'user' => $createdUser
        ], 201);
    }

    /**
     * POST /api/auth/login
     */
    public function login(): void
    {
        // Enforce rate limiting: 10 attempts per minute to mitigate brute force
        RateLimiter::check('auth_login', 10, 60);

        $body = Security::getJsonInput();
        $email = Security::sanitizeEmail($body['email'] ?? null);
        $password = $body['password'] ?? '';

        if (!$email || empty($password)) {
            Security::errorResponse('Email and password are required', 400);
        }

        // Query user by email
        $res = $this->supabase->select('profiles', ['email' => "eq.{$email}"], '*');

        if (!$res['success'] || empty($res['data'])) {
            // Timing attack mitigation: verify a dummy hash
            password_verify($password, '$2y$12$6k5YxWfEhzc8cKkXh95W3.o0eKSmj9kC1eJjT/8GgLp88JqjP05Ua');
            Security::errorResponse('Invalid email or password credentials', 401);
        }

        $user = $res['data'][0];

        // Constant-time password verification
        if (!password_verify($password, $user['password_hash'])) {
            Security::errorResponse('Invalid email or password credentials', 401);
        }

        if (empty($user['is_active'])) {
            Security::errorResponse('This account has been deactivated. Please contact support.', 403);
        }

        unset($user['password_hash']);

        // Resolve preferred language
        $addr = is_array($user['address'] ?? null) 
            ? $user['address'] 
            : (json_decode($user['address'] ?? '{}', true) ?: []);
        $user['preferred_language'] = $user['preferred_language'] ?? ($addr['preferred_language'] ?? 'ar');

        // Issue JWT token
        $token = Security::generateJwt([
            'sub' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'name' => $user['full_name']
        ]);

        Security::jsonResponse([
            'success' => true,
            'message' => 'Authentication successful',
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * GET /api/auth/me
     */
    public function me(): void
    {
        $authUser = AuthMiddleware::requireAuth();
        $userId = $authUser['sub'];

        $user = $this->supabase->findById('profiles', $userId, 'id, email, full_name, role, avatar_url, phone, address, created_at');

        if (!$user) {
            Security::errorResponse('User profile not found', 404);
        }

        $addr = is_array($user['address'] ?? null) 
            ? $user['address'] 
            : (json_decode($user['address'] ?? '{}', true) ?: []);
        $user['preferred_language'] = $user['preferred_language'] ?? ($addr['preferred_language'] ?? 'ar');

        Security::jsonResponse([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * PUT /api/auth/profile
     */
    public function updateProfile(): void
    {
        $authUser = AuthMiddleware::requireAuth();
        $userId = $authUser['sub'];
        $body = Security::getJsonInput();

        $allowedUpdates = [];
        if (isset($body['full_name'])) {
            $allowedUpdates['full_name'] = Security::sanitizeString($body['full_name']);
        }
        if (isset($body['phone'])) {
            $allowedUpdates['phone'] = Security::sanitizeString($body['phone']);
        }
        if (isset($body['avatar_url']) && filter_var($body['avatar_url'], FILTER_VALIDATE_URL)) {
            $allowedUpdates['avatar_url'] = filter_var($body['avatar_url'], FILTER_SANITIZE_URL);
        }
        if (isset($body['address']) && is_array($body['address'])) {
            $allowedUpdates['address'] = $body['address'];
        }
        if (isset($body['preferred_language'])) {
            $lang = strtolower(trim($body['preferred_language']));
            if (in_array($lang, ['ar', 'en', 'fr'], true)) {
                $currentProfile = $this->supabase->findById('profiles', $userId, 'id, address');
                $currentAddress = is_array($currentProfile['address'] ?? null) 
                    ? $currentProfile['address'] 
                    : (json_decode($currentProfile['address'] ?? '{}', true) ?: []);
                $currentAddress['preferred_language'] = $lang;
                $allowedUpdates['address'] = $currentAddress;
            }
        }

        if (empty($allowedUpdates)) {
            Security::errorResponse('No valid fields provided for update', 400);
        }

        $res = $this->supabase->update('profiles', ['id' => "eq.{$userId}"], $allowedUpdates);

        if (!$res['success']) {
            Security::errorResponse('Failed to update profile: ' . ($res['error'] ?? 'Unknown error'), 500);
        }

        $updated = $res['data'][0] ?? $allowedUpdates;
        unset($updated['password_hash']);

        $addr = is_array($updated['address'] ?? null) 
            ? $updated['address'] 
            : (json_decode($updated['address'] ?? '{}', true) ?: []);
        $updated['preferred_language'] = $updated['preferred_language'] ?? ($addr['preferred_language'] ?? 'ar');

        Security::jsonResponse([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $updated
        ]);
    }
}
