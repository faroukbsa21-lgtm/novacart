<?php

namespace App\Controllers;

use App\Config\Security;
use App\Middleware\RateLimiter;
use App\Services\SupabaseClient;

class ProductController
{
    private SupabaseClient $supabase;

    public function __construct()
    {
        $this->supabase = new SupabaseClient();
    }

    /**
     * GET /api/products
     * Filter by category, price, search, sorting and pagination
     */
    public function index(): void
    {
        RateLimiter::check('api_products', 180, 60);

        $params = ['is_active' => 'eq.true'];

        // Pagination
        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(50, max(1, (int)($_GET['limit'] ?? 12)));
        $offset = ($page - 1) * $limit;

        // Filter by Category
        if (!empty($_GET['category'])) {
            $cat = Security::sanitizeString($_GET['category']);
            if (Security::isValidUuid($cat)) {
                $params['category_id'] = "eq.{$cat}";
            } else {
                // Look up category by slug first
                $catRecord = $this->supabase->select('categories', ['slug' => "eq.{$cat}"], 'id');
                if (!empty($catRecord['data'])) {
                    $catId = $catRecord['data'][0]['id'];
                    $params['category_id'] = "eq.{$catId}";
                }
            }
        }

        // Filter by Price range
        if (isset($_GET['min_price']) && is_numeric($_GET['min_price'])) {
            $minPrice = (float)$_GET['min_price'];
            $params['price'] = "gte.{$minPrice}";
        }
        if (isset($_GET['max_price']) && is_numeric($_GET['max_price'])) {
            $maxPrice = (float)$_GET['max_price'];
            if (isset($params['price'])) {
                // If both, PostgREST allows multiple filters using and=(...)
                $params['and'] = "(price.gte.{$minPrice},price.lte.{$maxPrice})";
                unset($params['price']);
            } else {
                $params['price'] = "lte.{$maxPrice}";
            }
        }

        // Filter by Featured
        if (isset($_GET['featured']) && $_GET['featured'] === 'true') {
            $params['is_featured'] = 'eq.true';
        }

        // Search in title, description, or SKU with intelligent multilingual synonym expansion
        if (!empty($_GET['search'])) {
            $rawKeyword = trim(Security::sanitizeString($_GET['search']));
            $lower = function_exists('mb_strtolower') ? mb_strtolower($rawKeyword, 'UTF-8') : strtolower($rawKeyword);
            
            $keywords = [$rawKeyword];
            
            // Multilingual synonym mapping (French / Arabic / English)
            $synonymsMap = [
                'casque' => ['headphones', 'headset', 'aura', 'audio', 'earphones'],
                'ecouteur' => ['headphones', 'headset', 'aura', 'earphones'],
                'écouteur' => ['headphones', 'headset', 'aura', 'earphones'],
                'ecouteurs' => ['headphones', 'headset', 'aura', 'earphones'],
                'écouteurs' => ['headphones', 'headset', 'aura', 'earphones'],
                'سماعات' => ['headphones', 'headset', 'aura'],
                'clavier' => ['keyboard', 'lumix', 'mechanical'],
                'claviers' => ['keyboard', 'lumix', 'mechanical'],
                'لوحة مفاتيح' => ['keyboard', 'lumix'],
                'montre' => ['watch', 'chronos', 'steel', 'timepiece'],
                'montres' => ['watch', 'chronos', 'steel', 'timepiece'],
                'ساعة' => ['watch', 'chronos'],
                'sac' => ['backpack', 'bag', 'expedition', 'urban'],
                'sacs' => ['backpack', 'bag', 'expedition', 'urban'],
                'sacoche' => ['backpack', 'bag', 'expedition'],
                'cartable' => ['backpack', 'bag'],
                'حقيبة' => ['backpack', 'bag'],
                'cafe' => ['kettle', 'brewer', 'coffee', 'nordic'],
                'café' => ['kettle', 'brewer', 'coffee', 'nordic'],
                'cafetiere' => ['kettle', 'brewer', 'coffee'],
                'cafetière' => ['kettle', 'brewer', 'coffee'],
                'bouilloire' => ['kettle', 'brewer'],
                'theiere' => ['kettle', 'brewer'],
                'théière' => ['kettle', 'brewer'],
                'قهوة' => ['kettle', 'brewer'],
                'tracker' => ['fitness', 'quantum', 'smart', 'watch'],
                'fitness' => ['quantum', 'tracker', 'sport'],
                'sport' => ['quantum', 'fitness', 'tracker'],
            ];

            foreach ($synonymsMap as $term => $expanded) {
                if (str_contains($lower, $term)) {
                    foreach ($expanded as $syn) {
                        $keywords[] = $syn;
                    }
                }
            }

            $keywords = array_unique($keywords);
            $clauses = [];
            foreach ($keywords as $kw) {
                $clauses[] = "title.ilike.*{$kw}*";
                $clauses[] = "description.ilike.*{$kw}*";
                $clauses[] = "sku.ilike.*{$kw}*";
            }
            $params['or'] = '(' . implode(',', $clauses) . ')';
        }

        // Sorting
        $sort = $_GET['sort'] ?? 'newest';
        switch ($sort) {
            case 'price_asc':
                $params['order'] = 'price.asc';
                break;
            case 'price_desc':
                $params['order'] = 'price.desc';
                break;
            case 'rating_desc':
                $params['order'] = 'rating.desc';
                break;
            case 'newest':
            default:
                $params['order'] = 'created_at.desc';
                break;
        }

        $select = 'id, category_id, title, slug, description, price, compare_at_price, sku, stock_quantity, images, rating, num_reviews, is_featured, created_at, category:categories(id, name, slug)';
        $res = $this->supabase->select('products', $params, $select, $limit, $offset);

        if (!$res['success']) {
            Security::errorResponse($res['error'] ?? 'Failed to retrieve products', 500);
        }

        $products = $res['data'] ?? [];
        $total = $res['total'] ?? count($products);

        Security::jsonResponse([
            'success' => true,
            'data' => $products,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'total_pages' => $total > 0 ? (int)ceil($total / $limit) : 1
            ]
        ]);
    }

    /**
     * GET /api/products/featured
     */
    public function featured(): void
    {
        $select = 'id, title, slug, description, price, compare_at_price, stock_quantity, images, rating, num_reviews, category:categories(id, name, slug)';
        $res = $this->supabase->select('products', [
            'is_active' => 'eq.true',
            'is_featured' => 'eq.true',
            'order' => 'rating.desc',
            'limit' => 8
        ], $select);

        Security::jsonResponse([
            'success' => true,
            'data' => $res['data'] ?? []
        ]);
    }

    /**
     * GET /api/products/{idOrSlug}
     */
    public function show(string $idOrSlug): void
    {
        $cleanParam = Security::sanitizeString($idOrSlug);
        $filter = Security::isValidUuid($cleanParam) ? ['id' => "eq.{$cleanParam}"] : ['slug' => "eq.{$cleanParam}"];
        $filter['is_active'] = 'eq.true';

        $select = 'id, title, slug, description, price, compare_at_price, sku, stock_quantity, images, attributes, rating, num_reviews, is_featured, created_at, category:categories(id, name, slug)';
        $res = $this->supabase->select('products', $filter, $select, 1);

        if (!$res['success'] || empty($res['data'])) {
            Security::errorResponse('Product not found', 404);
        }

        $product = $res['data'][0];

        // Fetch recent approved reviews for this product
        $reviewsRes = $this->supabase->select('reviews', [
            'product_id' => "eq.{$product['id']}",
            'is_approved' => 'eq.true',
            'order' => 'created_at.desc',
            'limit' => 10
        ], 'id, user_name, rating, title, comment, is_verified_purchase, created_at');

        $product['reviews'] = $reviewsRes['data'] ?? [];

        Security::jsonResponse([
            'success' => true,
            'data' => $product
        ]);
    }
}
