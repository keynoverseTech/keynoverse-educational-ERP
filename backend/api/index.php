<?php
// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Autoloader (simplified - in production use Composer)
spl_autoload_register(function ($class) {
    $paths = [
        __DIR__ . '/controllers/' . $class . '.php',
        __DIR__ . '/models/' . $class . '.php',
        __DIR__ . '/middleware/' . $class . '.php',
        __DIR__ . '/utils/' . $class . '.php'
    ];
    
    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
});

// Simple routing
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove base path and query string
$basePath = '/api';
if (strpos($requestUri, $basePath) === 0) {
    $requestUri = substr($requestUri, strlen($basePath));
}
$requestUri = strtok($requestUri, '?');

// Parse route
$parts = explode('/', trim($requestUri, '/'));
$resource = $parts[0] ?? '';
$id = $parts[1] ?? null;
$action = $parts[2] ?? null;

try {
    // Rate limiting middleware
    $rateLimit = new RateLimitMiddleware();
    $request = $rateLimit->handle([]);
    
    // Public routes (no auth required)
    if ($resource === 'auth') {
        $authController = new AuthController();
        
        switch ($requestMethod) {
            case 'POST':
                if ($id === 'register') {
                    $authController->register($request);
                } elseif ($id === 'login') {
                    $authController->login();
                } elseif ($id === 'refresh') {
                    $authController->refresh();
                } elseif ($id === 'logout') {
                    // Logout requires auth
                    $authMiddleware = new AuthMiddleware();
                    $request = $authMiddleware->handle($request);
                    $authController->logout();
                }
                break;
            default:
                Response::json(['error' => 'Method not allowed'], 405);
        }
        exit;
    }
    
    // Protected routes (require authentication)
    $authMiddleware = new AuthMiddleware();
    $request = $authMiddleware->handle($request);
    
    // Role-based access
    switch ($resource) {
        case 'users':
            $roleMiddleware = new RoleMiddleware([], 'users.read');
            $request = $roleMiddleware->handle($request);
            
            $userController = new UserController();
            
            switch ($requestMethod) {
                case 'GET':
                    if ($id && !$action) {
                        $userController->getOne($request, $id);
                    } elseif ($id === 'me') {
                        $authController = new AuthController();
                        $authController->me($request);
                    } else {
                        $userController->getAll($request);
                    }
                    break;
                    
                case 'PUT':
                    if ($id) {
                        $userController->update($request, $id);
                    }
                    break;
                    
                case 'DELETE':
                    if ($id) {
                        $userController->delete($request, $id);
                    }
                    break;
                    
                case 'PATCH':
                    if ($id && $action === 'role') {
                        $userController->changeRole($request, $id);
                    }
                    break;
                    
                default:
                    Response::json(['error' => 'Method not allowed'], 405);
            }
            break;
            
        default:
            Response::json(['error' => 'Resource not found'], 404);
    }
    
} catch (Exception $e) {
    Logger::error('Unhandled exception', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
    Response::json(['error' => 'Internal server error'], 500);
}
?>