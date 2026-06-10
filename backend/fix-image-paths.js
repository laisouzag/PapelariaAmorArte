const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function fixImagePaths() {
    try {
        console.log('Connecting to MySQL...');
        console.log('DB_HOST:', process.env.DB_HOST);
        console.log('DB_USER:', process.env.DB_USER);
        console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
        console.log('DB_NAME:', process.env.DB_NAME);
        
        // Connect to MySQL database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'papelaria_amor_arte_completo'
        });

        console.log('Connected to MySQL database');
        
        // Read and execute fix_image_paths.sql
        const fixPath = path.join(__dirname, '../database/fix_image_paths.sql');
        const fixScript = fs.readFileSync(fixPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = fixScript.split(';').filter(s => s.trim());
        
        for (const statement of statements) {
            if (statement.trim() && !statement.trim().startsWith('--') && !statement.trim().startsWith('USE')) {
                try {
                    await connection.execute(statement);
                    console.log('Executed statement successfully');
                } catch (error) {
                    console.error('Error executing statement:', error.message);
                }
            }
        }

        console.log('Image paths fixed successfully!');
        await connection.end();
    } catch (error) {
        console.error('Error fixing image paths:', error.message);
        process.exit(1);
    }
}

fixImagePaths();
