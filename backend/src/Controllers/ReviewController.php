<?php

namespace App\Controllers;

use App\Config\Security;
use App\Middleware\AuthMiddleware;
use App\Middleware\RateLimiter;
use App\Services\SupabaseClient;

class ReviewController
{
    private SupabaseClient $supabase;

    public function __construct()
    {
        $this->supabase = new SupabaseClient();
    }

    /**
     * GET /api/reviews?product_id={uuid}
     */
    public function index(): void
    {
        $productId = Security::sanitizeString($_GET['product_id'] ?? '');

        if (!Security::isValidUuid($productId)) {
            Security::errorResponse('Valid product_id UUID is required', 400);
        }

        $res = $this->supabase->select('reviews', [
            'product_id' => "eq.{$productId}",
            'is_approved' => 'eq.true',
            'order' => 'created_at.desc'
        ]);

        Security::jsonResponse([
            'success' => true,
            'data' => $res['data'] ?? []
        ]);
    }

    /**
     * POST /api/reviews
     */
    public function create(): void
    {
        RateLimiter::check('review_post', 5, 60);
        $user = AuthMiddleware::requireAuth();

        $body = Security::getJsonInput();
        $productId = Security::sanitizeString($body['product_id'] ?? '');
        $rating = (int)($body['rating'] ?? 0);
        $title = Security::sanitizeString($body['title'] ?? '');
        $comment = Security::sanitizeString($body['comment'] ?? '');

        if (!Security::isValidUuid($productId)) {
            Security::errorResponse('Valid product ID is required', 400);
        }

        if ($rating < 1 || $rating > 5) {
            Security::errorResponse('Rating must be an integer between 1 and 5', 422);
        }

        if (strlen($comment) < 5) {
            Security::errorResponse('Review comment must be at least 5 characters', 422);
        }

        $reviewPayload = [
            'product_id' => $productId,
            'user_id' => $user['sub'],
            'user_name' => $user['name'] ?? 'Verified Buyer',
            'rating' => $rating,
            'title' => $title,
            'comment' => $comment,
            'is_verified_purchase' => true,
            'is_approved' => true
        ];

        $insertRes = $this->supabase->insert('reviews', [$reviewPayload]);

        if (!$insertRes['success']) {
            Security::errorResponse('Failed to submit review', 500);
        }

        // Recalculate product rating
        $allReviews = $this->supabase->select('reviews', [
            'product_id' => "eq.{$productId}",
            'is_approved' => 'eq.true'
        ], 'rating');

        if (!empty($allReviews['data'])) {
            $ratings = array_column($allReviews['data'], 'rating');
            $avgRating = round(array_sum($ratings) / count($ratings), 2);
            $totalCount = count($ratings);

            $this->supabase->update('products', ['id' => "eq.{$productId}"], [
                'rating' => $avgRating,
                'num_reviews' => $totalCount
            ]);
        }

        Security::jsonResponse([
            'success' => true,
            'message' => 'Review submitted successfully',
            'data' => $insertRes['data'][0] ?? $reviewPayload
        ], 201);
    }
}
