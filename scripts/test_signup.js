import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables manually
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

console.log('Testing signup with URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Attempting to sign up user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Signup Error:', error);
    } else {
        console.log('Signup Success:', data);
        if (data.user && data.session) {
            console.log('User created and session active. Backend is working correctly.');
        } else if (data.user && !data.session) {
            console.log('User created but NO session. Email confirmation might be required (unexpected).');
        }
    }
}

testSignup();
