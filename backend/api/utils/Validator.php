<?php
class Validator {
    private $errors = [];
    
    public function validate($data, $rules) {
        $this->errors = [];
        
        foreach ($rules as $field => $rule) {
            $rulesList = explode('|', $rule);
            
            foreach ($rulesList as $singleRule) {
                $this->validateRule($field, $data[$field] ?? null, $singleRule, $data);
            }
        }
        
        return [
            'valid' => empty($this->errors),
            'errors' => $this->errors
        ];
    }
    
    private function validateRule($field, $value, $rule, $allData) {
        // Required rule
        if ($rule === 'required' && (empty($value) && $value !== '0')) {
            $this->errors[$field][] = ucfirst($field) . ' is required';
        }
        
        // Min length rule
        if (strpos($rule, 'min:') === 0) {
            $min = (int)explode(':', $rule)[1];
            if (strlen($value) < $min) {
                $this->errors[$field][] = ucfirst($field) . ' must be at least ' . $min . ' characters';
            }
        }
        
        // Max length rule (NEW)
        if (strpos($rule, 'max:') === 0) {
            $max = (int)explode(':', $rule)[1];
            if (strlen($value) > $max) {
                $this->errors[$field][] = ucfirst($field) . ' must not exceed ' . $max . ' characters';
            }
        }
        
        // Email rule
        if ($rule === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field][] = 'Invalid email format';
        }
        
        // Password regex rule
        if ($rule === 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/') {
            if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $value)) {
                $this->errors[$field][] = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
            }
        }
        
        // In rule
        if (strpos($rule, 'in:') === 0) {
            $options = explode(',', substr($rule, 3));
            if (!in_array($value, $options)) {
                $this->errors[$field][] = ucfirst($field) . ' must be one of: ' . implode(', ', $options);
            }
        }
        
        // Unique rule (simplified - would need database connection)
        if (strpos($rule, 'unique:') === 0) {
            // This would require database connection in production
            // For now, we'll skip the actual check
        }
    }
}
?>