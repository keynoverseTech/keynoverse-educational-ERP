<?php
class RateLimitMiddleware {
    private $maxRequests = 100; // Max requests per window
    private $window = 3600; // Time window in seconds (1 hour)
    
    public function handle($request) {
        $ip = $_SERVER['REMOTE_ADDR'];
        $key = 'rate_limit:' . $ip;
        
        // In production, use Redis or Memcached
        // For this example, we'll use a simple file-based approach
        $rateFile = sys_get_temp_dir() . '/' . md5($key) . '.txt';
        
        $currentTime = time();
        $requests = [];
        
        if (file_exists($rateFile)) {
            $requests = json_decode(file_get_contents($rateFile), true) ?: [];
            // Remove old requests
            $requests = array_filter($requests, function($timestamp) use ($currentTime) {
                return $timestamp > ($currentTime - $this->window);
            });
        }
        
        if (count($requests) >= $this->maxRequests) {
            Response::json(['error' => 'Too many requests'], 429);
            exit;
        }
        
        $requests[] = $currentTime;
        file_put_contents($rateFile, json_encode($requests));
        
        return $request;
    }
}
?>