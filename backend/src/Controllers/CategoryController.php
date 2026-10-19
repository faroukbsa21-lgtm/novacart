<?php

namespace App\Controllers;

use App\Config\Security;
use App\Services\SupabaseClient;

class CategoryController
{
    private SupabaseClient $supabase;

    public function __construct()
    {
        $this->supabase = new SupabaseClient();
    }

    /**
     * GET /api/categories
     */
    public function index(): void
    {
        $res = $this->supabase->select('categories', [
            'order' => 'display_order.asc'
        ], 'id, name, slug, description, image_url, icon_name');

        if (!$res['success']) {
            Security::errorResponse($res['error'] ?? 'Failed to retrieve categories', 500);
        }

        Security::jsonResponse([
            'success' => true,
            'data' => $res['data'] ?? []
        ]);
    }

    /**
     * GET /api/categories/{idOrSlug}
     */
    public function show(string $idOrSlug): void
    {
        $clean = Security::sanitizeString($idOrSlug);
        $filter = Security::isValidUuid($clean) ? ['id' => "eq.{$clean}"] : ['slug' => "eq.{$clean}"];

        $res = $this->supabase->select('categories', $filter, '*', 1);

        if (!$res['success'] || empty($res['data'])) {
            Security::errorResponse('Category not found', 404);
        }

        Security::jsonResponse([
            'success' => true,
            'data' => $res['data'][0]
        ]);
    }
}
