<?php
require_once __DIR__ . '/../config/roles.php';

class RoleMiddleware {
    private $allowedRoles;
    private $requiredPermission;
    
    public function __construct($allowedRoles = [], $requiredPermission = null) {
        $this->allowedRoles = $allowedRoles;
        $this->requiredPermission = $requiredPermission;
    }
    
    public function handle($request) {
        global $rolePermissions;
        
        $userRole = $request['user_role'];
        
        // Check if role is allowed
        if (!empty($this->allowedRoles) && !in_array($userRole, $this->allowedRoles)) {
            Response::json(['error' => 'Forbidden - Insufficient role permissions'], 403);
            exit;
        }
        
        // Check specific permission if required
        if ($this->requiredPermission) {
            list($resource, $action) = explode('.', $this->requiredPermission);
            
            if (!isset($rolePermissions[$userRole][$resource]) || 
                !in_array($action, $rolePermissions[$userRole][$resource])) {
                Response::json(['error' => 'Forbidden - Insufficient permissions'], 403);
                exit;
            }
        }
        
        return $request;
    }
}
?>