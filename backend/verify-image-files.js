const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function verifyImageFiles() {
    try {
        console.log('Connecting to MySQL...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'papelaria_amor_arte_completo'
        });

        console.log('Connected to MySQL database');
        
        // Get all image paths from database
        const [images] = await connection.query('SELECT id, product_id, image_url FROM product_images');
        
        console.log('\n=== VERIFYING IMAGE FILES ===');
        
        const imgDir = path.join(__dirname, '..', 'img');
        const actualFiles = fs.readdirSync(imgDir);
        
        console.log(`\nFiles in img directory: ${actualFiles.length}`);
        
        let missingFiles = [];
        let foundFiles = [];
        
        images.forEach(img => {
            const fileName = img.image_url.replace('img/', '');
            const fullPath = path.join(imgDir, fileName);
            const exists = fs.existsSync(fullPath);
            
            if (exists) {
                foundFiles.push(fileName);
                console.log(`✓ ${fileName} - EXISTS`);
            } else {
                missingFiles.push(fileName);
                console.log(`✗ ${fileName} - MISSING`);
            }
        });
        
        console.log(`\n=== SUMMARY ===`);
        console.log(`Total images in DB: ${images.length}`);
        console.log(`Files found: ${foundFiles.length}`);
        console.log(`Files missing: ${missingFiles.length}`);
        
        if (missingFiles.length > 0) {
            console.log('\n=== MISSING FILES ===');
            missingFiles.forEach(file => console.log(`- ${file}`));
        }
        
        await connection.end();
    } catch (error) {
        console.error('Error verifying image files:', error.message);
        process.exit(1);
    }
}

verifyImageFiles();
