const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function fixRemainingPath() {
    try {
        console.log('Connecting to MySQL...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'papelaria_amor_arte_completo'
        });

        console.log('Connected to MySQL database');
        
        // Fix the remaining path with subdirectory
        await connection.execute(
            "UPDATE product_images SET image_url = 'img/Agenda2026Personalizada.png' WHERE image_url = 'img/Agendas-Planners/Agenda2026Personalizada.png'"
        );
        
        console.log('Fixed remaining path');
        
        // Verify the fix
        const [images] = await connection.query('SELECT id, product_id, image_url FROM product_images WHERE id = 1');
        console.log('Updated path:', images[0]);
        
        await connection.end();
    } catch (error) {
        console.error('Error fixing remaining path:', error.message);
        process.exit(1);
    }
}

fixRemainingPath();
