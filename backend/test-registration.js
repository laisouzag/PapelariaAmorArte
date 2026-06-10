const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testRegistration() {
    try {
        console.log('Connecting to MySQL...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'papelaria_amor_arte_completo'
        });

        console.log('Connected to MySQL database');
        
        // Check users table structure
        console.log('\n=== USERS TABLE STRUCTURE ===');
        const [columns] = await connection.query('DESCRIBE users');
        columns.forEach(col => {
            console.log(`Field: ${col.Field}, Type: ${col.Type}, Null: ${col.Null}, Key: ${col.Key}`);
        });
        
        // Check if users table has data
        console.log('\n=== USERS COUNT ===');
        const [count] = await connection.query('SELECT COUNT(*) as count FROM users');
        console.log(`Total users: ${count[0].count}`);
        
        // Try to insert a test user
        console.log('\n=== TESTING USER INSERTION ===');
        const testEmail = `test${Date.now()}@example.com`;
        const testData = {
            name: 'Test User',
            email: testEmail,
            phone: '(11) 99999-9999',
            cpf: '12345678901',
            password: 'test123'
        };
        
        console.log(`Attempting to insert user with email: ${testEmail}`);
        
        const [result] = await connection.query(
            'INSERT INTO users (name, email, phone, cpf, password) VALUES (?, ?, ?, ?, ?)',
            [testData.name, testData.email, testData.phone, testData.cpf, testData.password]
        );
        
        console.log(`User inserted successfully! ID: ${result.insertId}`);
        
        // Clean up test user
        await connection.query('DELETE FROM users WHERE id = ?', [result.insertId]);
        console.log('Test user deleted');
        
        await connection.end();
        console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
    } catch (error) {
        console.error('\n=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
        process.exit(1);
    }
}

testRegistration();
