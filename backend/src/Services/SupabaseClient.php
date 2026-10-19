<?php

namespace App\Services;

use App\Config\Env;
use App\Config\Security;
use Exception;

class SupabaseClient
{
    private string $baseUrl;
    private string $serviceRoleKey;
    private string $anonKey;

    public function __construct()
    {
        $this->baseUrl = rtrim(Env::get('SUPABASE_URL', ''), '/');
        $this->serviceRoleKey = Env::get('SUPABASE_SERVICE_ROLE_KEY', '');
        $this->anonKey = Env::get('SUPABASE_ANON_KEY', '');

        if (empty($this->baseUrl) || empty($this->serviceRoleKey)) {
            // Note: If credentials are not set, requests will gracefully report connection config needed
        }
    }

    /**
     * Check if client credentials are fully configured
     */
    public function isConfigured(): bool
    {
        return !empty($this->baseUrl) && 
               !empty($this->serviceRoleKey) && 
               strpos($this->baseUrl, 'App') === false;
    }

    /**
     * Send secure HTTP request to Supabase PostgREST API
     */
    private function request(string $method, string $endpoint, array $queryParams = [], array $body = [], array $customHeaders = []): array
    {
        if (!$this->isConfigured()) {
            return [
                "success" => false,
                "status" => 500,
                "error" => "Supabase credentials are not configured. Please edit backend/.env with your Supabase URL and keys."
            ];
        }

        $url = "{$this->baseUrl}/rest/v1/{$endpoint}";
        if (!empty($queryParams)) {
            $queryString = http_build_query($queryParams);
            // Replace encoded commas for Supabase PostgREST array operators e.g. in.(...)
            $queryString = str_replace(['%28', '%29', '%2C'], ['(', ')', ','], $queryString);
            $url .= "?{$queryString}";
        }

        $headers = [
            "apikey: {$this->serviceRoleKey}",
            "Authorization: Bearer {$this->serviceRoleKey}",
            "Content-Type: application/json",
            "Accept: application/json"
        ];

        foreach ($customHeaders as $h) {
            $headers[] = $h;
        }

        $rawHeaders = '';
        $rawBody = '';
        $httpCode = 0;

        if (function_exists('curl_init')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_HEADER, true); // Retrieve headers for Range / Content-Range

            // Strict SSL and Security controls
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
            curl_setopt($ch, CURLOPT_TIMEOUT, 15);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Ecom-Secure-Backend/1.0');

            if (!empty($body) && in_array($method, ['POST', 'PUT', 'PATCH'])) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
            }

            $response = curl_exec($ch);
            $curlError = curl_error($ch);
            $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            curl_close($ch);

            if ($response === false) {
                error_log("Supabase cURL Error: {$curlError}");
                return [
                    "success" => false,
                    "status" => 502,
                    "error" => "Network error connecting to database service."
                ];
            }

            $rawHeaders = substr($response, 0, $headerSize);
            $rawBody = substr($response, $headerSize);
        } else {
            // Built-in PHP streams fallback when ext-curl is not enabled
            $httpHeaders = implode("\r\n", $headers) . "\r\n";
            $httpOptions = [
                'method' => $method,
                'header' => $httpHeaders,
                'ignore_errors' => true,
                'timeout' => 15
            ];

            if (!empty($body) && in_array($method, ['POST', 'PUT', 'PATCH'])) {
                $httpOptions['content'] = json_encode($body);
            }

            $context = stream_context_create([
                'http' => $httpOptions,
                'ssl' => [
                    'verify_peer' => true,
                    'verify_peer_name' => true
                ]
            ]);

            $rawBody = @file_get_contents($url, false, $context);
            if ($rawBody === false && (!isset($http_response_header) || empty($http_response_header))) {
                error_log("Supabase Stream HTTP Error: Unable to connect to {$url}");
                return [
                    "success" => false,
                    "status" => 502,
                    "error" => "Network error connecting to database service."
                ];
            }

            $rawHeaders = isset($http_response_header) ? implode("\r\n", $http_response_header) : '';
            if (isset($http_response_header[0]) && preg_match('#HTTP/\S+\s+(\d+)#i', $http_response_header[0], $matches)) {
                $httpCode = (int)$matches[1];
            }
        }
        $data = json_decode($rawBody, true);

        // Parse content range if available (e.g. 0-9/42 for pagination total count)
        $totalCount = null;
        if (preg_match('/content-range:\s*\d+-\d+\/(\d+|\*)/i', $rawHeaders, $matches)) {
            $totalCount = ($matches[1] !== '*') ? (int)$matches[1] : null;
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            return [
                "success" => true,
                "status" => $httpCode,
                "data" => $data ?? [],
                "total" => $totalCount
            ];
        }

        $errorMessage = $data['message'] ?? $data['error'] ?? "Database returned HTTP {$httpCode}";
        error_log("Supabase API Error [{$httpCode}]: {$errorMessage}");

        return [
            "success" => false,
            "status" => $httpCode,
            "error" => $errorMessage,
            "details" => Env::isProduction() ? null : ($data['hint'] ?? $data['details'] ?? null)
        ];
    }

    /**
     * SELECT query
     */
    public function select(string $table, array $params = [], string $select = '*', ?int $limit = null, int $offset = 0): array
    {
        $queryParams = ['select' => $select];

        if ($limit !== null) {
            $queryParams['limit'] = $limit;
            $queryParams['offset'] = $offset;
        }

        // Merge filters
        foreach ($params as $key => $value) {
            $queryParams[$key] = $value;
        }

        $headers = ["Prefer: count=exact"];
        return $this->request('GET', $table, $queryParams, [], $headers);
    }

    /**
     * SELECT single record by ID
     */
    public function findById(string $table, string $id, string $select = '*'): ?array
    {
        if (!Security::isValidUuid($id)) {
            return null;
        }

        $res = $this->request('GET', $table, [
            'id' => "eq.{$id}",
            'select' => $select,
            'limit' => 1
        ]);

        if ($res['success'] && !empty($res['data'])) {
            return $res['data'][0];
        }

        return null;
    }

    /**
     * INSERT record(s) and return the created record(s)
     */
    public function insert(string $table, array $data): array
    {
        $headers = ["Prefer: return=representation"];
        return $this->request('POST', $table, [], $data, $headers);
    }

    /**
     * UPDATE record(s) matching filter
     */
    public function update(string $table, array $filters, array $data): array
    {
        $headers = ["Prefer: return=representation"];
        return $this->request('PATCH', $table, $filters, $data, $headers);
    }

    /**
     * DELETE record(s) matching filter
     */
    public function delete(string $table, array $filters): array
    {
        $headers = ["Prefer: return=representation"];
        return $this->request('DELETE', $table, $filters, [], $headers);
    }

    /**
     * Call Supabase Database Function (RPC)
     */
    public function rpc(string $functionName, array $params = []): array
    {
        return $this->request('POST', "rpc/{$functionName}", [], $params);
    }
}
