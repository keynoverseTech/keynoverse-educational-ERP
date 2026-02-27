<?php
require_once __DIR__ . '/../config/jwt.php';

class AuthMiddleware {
    public function handle($request) {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            $payload = $this->validateToken($token);
            
            if ($payload) {
                $request['user_id'] = $payload->sub;
                $request['user_role'] = $payload->role;
                $request['user'] = [
                    'id' => $payload->sub,
                    'email' => $payload->email,
                    'role' => $payload->role
                ];
                return $request;
            }
        }
        
        Response::json(['error' => 'Unauthorized - Invalid or missing token'], 401);
        exit;
    }
    
    private function validateToken($token) {
        $parts = explode('.', $token);
        
        if (count($parts) != 3) {
            return false;
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignatureCheck = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if ($base64UrlSignatureCheck !== $base64UrlSignature) {
            return false;
        }
        
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlPayload)));
        
        // Check expiration
        if (isset($payload->exp) && $payload->exp < time()) {
            return false;
        }
        
        // Check issuer
        if (isset($payload->iss) && $payload->iss !== JWT_ISSUER) {
            return false;
        }
        
        // Check audience
        if (isset($payload->aud) && $payload->aud !== JWT_AUDIENCE) {
            return false;
        }
        
        return $payload;
    }
}
?>