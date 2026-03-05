const BASE_URL = 'https://erp-api-production-024c.up.railway.app/api';

async function testLogin(role, endpoint, credentials) {
    console.log(`\n=== Testing ${role} Login (${endpoint}) ===`);
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        try {
            const json = JSON.parse(text);
            console.log('Response:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Response (text):', text);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function run() {
    // Test School Admin (Manager)
    await testLogin('School Admin', '/auth/admin/login', {
        email: 'manager@planetstech.com',
        password: 'admin@password'
    });
    
    // Test with alternative email just in case
    await testLogin('School Admin (Alt)', '/auth/admin/login', {
        email: 'admin@planetstech.com',
        password: 'admin@password'
    });
}

run();
