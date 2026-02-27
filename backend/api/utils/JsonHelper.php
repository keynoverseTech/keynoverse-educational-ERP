<?php
class JsonHelper {
    /**
     * Safely encode data to JSON string for storage in TEXT field
     */
    public static function encode($data) {
        if ($data === null) {
            return null;
        }
        return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    
    /**
     * Safely decode JSON string from TEXT field
     */
    public static function decode($jsonString, $assoc = true) {
        if ($jsonString === null || $jsonString === '') {
            return null;
        }
        return json_decode($jsonString, $assoc);
    }
    
    /**
     * Check if a string is valid JSON
     */
    public static function isValid($string) {
        if ($string === null || $string === '') {
            return false;
        }
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
    
    /**
     * Format JSON string for pretty printing
     */
    public static function prettyPrint($data) {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
?>