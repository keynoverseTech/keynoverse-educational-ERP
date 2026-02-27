<?php
// Update the create method to handle UTF-8 properly
public function create($data) {
    $validator = new Validator();
    $rules = [
        'email' => 'required|email|unique:users,email|max:191', // Added max:191
        'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
        'first_name' => 'required|string|max:50',
        'last_name' => 'required|string|max:50',
        'role' => 'required|in:' . implode(',', [ROLE_PLANETSTECH, ROLE_NBTE, ROLE_INSTITUTIONS, ROLE_STAFF, ROLE_STUDENT, ROLE_USER])
    ];
    
    // ... rest of the method
}

// Update database connection to handle UTF-8 properly
private function __construct() {
    try {
        $this->connection = new PDO(
            "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4",
            $this->username,
            $this->password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ]
        );
    } catch(PDOException $e) {
        error_log("Connection failed: " . $e->getMessage());
        throw new Exception("Database connection failed");
    }
}