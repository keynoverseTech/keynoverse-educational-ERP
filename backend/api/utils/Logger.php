<?php
class Logger {
    private static $logFile = __DIR__ . '/../../logs/app.log';
    private static $maxSize = 10485760; // 10MB
    private static $db = null;
    
    public static function setDatabase($db) {
        self::$db = $db;
    }
    
    public static function info($message, $context = []) {
        self::log('INFO', $message, $context);
    }
    
    public static function error($message, $context = []) {
        self::log('ERROR', $message, $context);
    }
    
    public static function warning($message, $context = []) {
        self::log('WARNING', $message, $context);
    }
    
    public static function audit($userId, $action, $entityType, $entityId, $oldValues = null, $newValues = null) {
        // Log to database
        if (self::$db) {
            try {
                $query = "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) 
                          VALUES (:user_id, :action, :entity_type, :entity_id, :old_values, :new_values, :ip_address, :user_agent, NOW())";
                
                $stmt = self::$db->prepare($query);
                
                $ip = $_SERVER['REMOTE_ADDR'] ?? null;
                $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
                
                // Convert arrays to JSON strings for storage
                $oldValuesJson = $oldValues ? json_encode($oldValues) : null;
                $newValuesJson = $newValues ? json_encode($newValues) : null;
                
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':action', $action);
                $stmt->bindParam(':entity_type', $entityType);
                $stmt->bindParam(':entity_id', $entityId);
                $stmt->bindParam(':old_values', $oldValuesJson);
                $stmt->bindParam(':new_values', $newValuesJson);
                $stmt->bindParam(':ip_address', $ip);
                $stmt->bindParam(':user_agent', $userAgent);
                
                $stmt->execute();
            } catch (Exception $e) {
                self::error('Failed to write audit log', ['error' => $e->getMessage()]);
            }
        }
        
        // Also log to file
        self::log('AUDIT', $action, [
            'user_id' => $userId,
            'entity_type' => $entityType,
            'entity_id' => $entityId
        ]);
    }
    
    private static function log($level, $message, $context = []) {
        $logDir = dirname(self::$logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        // Rotate log file if too large
        if (file_exists(self::$logFile) && filesize(self::$logFile) > self::$maxSize) {
            rename(self::$logFile, self::$logFile . '.' . date('Y-m-d-H-i-s'));
        }
        
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'CLI';
        $userId = isset($_SERVER['HTTP_USER_ID']) ? $_SERVER['HTTP_USER_ID'] : 'anonymous';
        
        $logEntry = sprintf(
            "[%s] [%s] [%s] [%s] %s %s\n",
            $timestamp,
            $level,
            $ip,
            $userId,
            $message,
            !empty($context) ? json_encode($context) : ''
        );
        
        file_put_contents(self::$logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
}
?>