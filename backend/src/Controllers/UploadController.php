<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Security;
use App\Middleware\AuthMiddleware;

class UploadController
{
    /**
     * Handle secure image upload (products & avatars)
     */
    public function upload(): void
    {
        // 1. Verify user is authenticated
        $user = AuthMiddleware::authenticate();

        if (empty($_FILES['image'])) {
            Security::errorResponse("No image file uploaded", 400);
            return;
        }

        $file = $_FILES['image'];

        // 2. Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            Security::errorResponse("Upload failed with error code: {$file['error']}", 400);
            return;
        }

        // 3. Limit file size (5MB max)
        $maxBytes = 5 * 1024 * 1024;
        if ($file['size'] > $maxBytes) {
            Security::errorResponse("File size exceeds 5MB limit", 400);
            return;
        }

        // 4. Validate true MIME type using finfo (never rely on client-reported headers)
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $realMime = $finfo->file($file['tmp_name']);

        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'image/avif' => 'avif'
        ];

        if (!array_key_exists($realMime, $allowedMimes)) {
            Security::errorResponse("Invalid image format. Allowed types: JPG, PNG, WEBP, AVIF", 400);
            return;
        }

        $ext = $allowedMimes[$realMime];

        // 5. Generate collision-proof random filename
        $folderType = ($_POST['type'] ?? 'product') === 'avatar' ? 'avatars' : 'products';
        $filename = bin2hex(random_bytes(16)) . '.' . $ext;

        $targetDir = __DIR__ . '/../../public/uploads/' . $folderType . '/';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $destination = $targetDir . $filename;

        // 6. Move file safely
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            Security::errorResponse("Failed to save uploaded file", 500);
            return;
        }

        // 7. Generate public absolute URL
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
        $publicUrl = "{$scheme}://{$host}/uploads/{$folderType}/{$filename}";

        Security::jsonResponse([
            'status' => 'success',
            'url' => $publicUrl,
            'filename' => $filename,
            'type' => $folderType,
            'mime' => $realMime,
            'size' => $file['size']
        ], 201);
    }
}
