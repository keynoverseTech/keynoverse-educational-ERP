<?php
define('ROLE_PLANETSTECH', 'planets_tech');
define('ROLE_NBTE', 'nbte');
define('ROLE_INSTITUTIONS', 'institutions');
define('ROLE_STAFF', 'staff');
define('ROLE_STUDENT', 'student');
define('ROLE_USER', 'user');

$roleHierarchy = [
    ROLE_PLANETSTECH => 100,
    ROLE_NBTE => 90,
    ROLE_INSTITUTIONS => 80,
    ROLE_STAFF => 70,
    ROLE_STUDENT => 60,
    ROLE_USER => 50
];

$rolePermissions = [
    ROLE_PLANETSTECH => [
        'users' => ['create', 'read', 'update', 'delete'],
        'roles' => ['create', 'read', 'update', 'delete'],
        'system' => ['configure']
    ],
    ROLE_NBTE => [
        'users' => ['create', 'read', 'update'],
        'institutions' => ['create', 'read', 'update'],
        'reports' => ['read', 'generate']
    ],
    ROLE_INSTITUTIONS => [
        'users' => ['create', 'read', 'update'],
        'staff' => ['create', 'read', 'update'],
        'students' => ['create', 'read', 'update'],
        'courses' => ['create', 'read', 'update']
    ],
    ROLE_STAFF => [
        'students' => ['read', 'update'],
        'courses' => ['read'],
        'attendance' => ['create', 'read', 'update']
    ],
    ROLE_STUDENT => [
        'profile' => ['read', 'update'],
        'courses' => ['read'],
        'grades' => ['read']
    ],
    ROLE_USER => [
        'profile' => ['read', 'update']
    ]
];
?>