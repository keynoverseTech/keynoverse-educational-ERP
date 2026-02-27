<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Token.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../config/jwt.php';

class AuthController {
    private $userModel;
    private $tokenModel;
    
    public function __construct() {
        $this->userModel = new User();
        $this->tokenModel = new Token();
    }
    
    public function register($request) {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            Response::json(['error' => 'Invalid request data'], 400);
            return;
        }
        
        $result = $this->userModel->create($data);
        
        if ($result['success']) {
            Response::json([
                'message' => $result['message'],
                'user_id' => $result['user_id']
            ], 201);
        } else {
            $statusCode = isset($result['errors']) ? 422 : 500;
            Response::json($result, $statusCode);
        }
    }
    
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            Response::json(['error' => 'Email and password required'], 400);
            return;
        }
        
        $user = $this->userModel->findByEmail($data['email']);
        
        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            Response::json(['error' => 'Invalid credentials'], 401);
            return;
        }
        
        if (!$user['is_active']) {
            Response::json(['error' => 'Account is deactivated'], 403);
            return;
        }
        
        // Update last login
        $this->userModel->updateLastLogin($user['id']);
        
        // Generate tokens
        $accessToken = $this->generateAccessToken($user);
        $refreshToken = $this->generateRefreshToken();
        
        // Store refresh token
        $expiresAt = date('Y-m-d H:i:s', time() + JWT_REFRESH_EXPIRY);
        $this->tokenModel->create($user['id'], $refreshToken, $expiresAt);
        
        Response::json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => JWT_EXPIRY,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'role' => $user['role']
            ]
        ]);
    }
    
    public function refresh() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['refresh_token'])) {
            Response::json(['error' => 'Refresh token required'], 400);
            return;
        }
        
        $tokenData = $this->tokenModel->validate($data['refresh_token']);
        
        if (!$tokenData) {
            Response::json(['error' => 'Invalid or expired refresh token'], 401);
            return;
        }
        
        $user = $this->userModel->findById($tokenData['user_id']);
        
        if (!$user) {
            Response::json(['error' => 'User not found'], 401);
            return;
        }
        
        // Revoke old refresh token
        $this->tokenModel->revoke($data['refresh_token']);
        
        // Generate new tokens
        $accessToken = $this->generateAccessToken($user);
        $refreshToken = $this->generateRefreshToken();
        
        // Store new refresh token
        $expiresAt = date('Y-m-d H:i:s', time() + JWT_REFRESH_EXPIRY);
        $this->tokenModel->create($user['id'], $refreshToken, $expiresAt);
        
        Response::json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => JWT_EXPIRY
        ]);
    }
    
    public function logout() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            // Note: Access tokens are stateless, so we don't need to revoke them
            // If using refresh token in request, revoke it
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['refresh_token'])) {
                $this->tokenModel->revoke($data['refresh_token']);
            }
        }
        
        Response::json(['message' => 'Logged out successfully']);
    }
    
    public function me($request) {
        $user = $this->userModel->findById($request['user_id']);
        
        if (!$user) {
            Response::json(['error' => 'User not found'], 404);
            return;
        }
        
        Response::json(['user' => $user]);
    }
    
    private function generateAccessToken($user) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'iss' => JWT_ISSUER,
            'aud' => JWT_AUDIENCE,
            'iat' => time(),
            'exp' => time() + JWT_EXPIRY,
            'sub' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    private function generateRefreshToken() {
        return bin2hex(random_bytes(64));
    }
}
?>