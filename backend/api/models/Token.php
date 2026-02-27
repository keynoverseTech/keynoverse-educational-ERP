<?php
require_once __DIR__ . '/../config/database.php';

class Token {
    private $db;
    private $table = 'refresh_tokens';
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function create($userId, $token, $expiresAt) {
        try {
            $query = "INSERT INTO {$this->table} (user_id, token, expires_at, created_at) 
                      VALUES (:user_id, :token, :expires_at, NOW())";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':token', $token);
            $stmt->bindParam(':expires_at', $expiresAt);
            
            return $stmt->execute();
            
        } catch(PDOException $e) {
            error_log("Token creation failed: " . $e->getMessage());
            return false;
        }
    }
    
    public function validate($token) {
        try {
            $query = "SELECT * FROM {$this->table} 
                      WHERE token = :token AND expires_at > NOW() AND revoked = 0";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            
            return $stmt->fetch();
            
        } catch(PDOException $e) {
            error_log("Token validation failed: " . $e->getMessage());
            return false;
        }
    }
    
    public function revoke($token) {
        try {
            $query = "UPDATE {$this->table} SET revoked = 1 WHERE token = :token";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':token', $token);
            
            return $stmt->execute();
            
        } catch(PDOException $e) {
            error_log("Token revocation failed: " . $e->getMessage());
            return false;
        }
    }
    
    public function revokeAllForUser($userId) {
        try {
            $query = "UPDATE {$this->table} SET revoked = 1 WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            
            return $stmt->execute();
            
        } catch(PDOException $e) {
            error_log("Revoke all tokens failed: " . $e->getMessage());
            return false;
        }
    }
}
?>