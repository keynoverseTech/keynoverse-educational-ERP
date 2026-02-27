<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/Logger.php';
require_once __DIR__ . '/../config/roles.php';

class UserController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new User();
        // Set database connection for logger
        global $db; // You'd need to pass this properly in production
        Logger::setDatabase($db);
    }
    
    public function update($request, $id) {
        $currentUser = $request['user'];
        
        // Check if user has permission to update
        if ($currentUser['id'] != $id && $currentUser['role'] != ROLE_PLANETSTECH) {
            Response::json(['error' => 'Unauthorized to update this user'], 403);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            Response::json(['error' => 'Invalid request data'], 400);
            return;
        }
        
        // Get old values for audit
        $oldUser = $this->userModel->findById($id);
        
        $result = $this->userModel->update($id, $data);
        
        if ($result['success']) {
            // Log the update action
            Logger::audit(
                $currentUser['id'],
                'UPDATE',
                'user',
                $id,
                $oldUser, // Old values
                array_intersect_key($data, array_flip(['first_name', 'last_name', 'email'])) // New values
            );
            
            Response::json(['message' => $result['message']]);
        } else {
            Response::json(['error' => $result['message']], 500);
        }
    }
    
    public function delete($request, $id) {
        $currentUser = $request['user'];
        
        // Only PlanetsTech and NBTE can delete users
        if (!in_array($currentUser['role'], [ROLE_PLANETSTECH, ROLE_NBTE])) {
            Response::json(['error' => 'Unauthorized to delete users'], 403);
            return;
        }
        
        // Prevent self-deletion
        if ($currentUser['id'] == $id) {
            Response::json(['error' => 'Cannot delete your own account'], 400);
            return;
        }
        
        // Get user for audit
        $deletedUser = $this->userModel->findById($id);
        
        $result = $this->userModel->delete($id);
        
        if ($result['success']) {
            // Log the delete action
            Logger::audit(
                $currentUser['id'],
                'DELETE',
                'user',
                $id,
                $deletedUser, // Store deleted user info
                null
            );
            
            Response::json(['message' => $result['message']]);
        } else {
            Response::json(['error' => $result['message']], 500);
        }
    }
}
?>