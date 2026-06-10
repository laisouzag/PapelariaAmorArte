const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function initializeDatabase() {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
        console.error('DATABASE_URL environment variable is not defined!');
        process.exit(1);
    }

    console.log('Connecting to PostgreSQL database...');
    
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL successfully.');

        // Read the schema_completo_postgres.sql file
        const schemaPath = path.join(__dirname, '../database/schema_completo_postgres.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split queries by semicolon and filter out empty ones
        const queries = schema.split(';').map(q => q.trim()).filter(q => q.length > 0);

        console.log(`Executing ${queries.length} SQL commands to build database structure...`);

        for (let i = 0; i < queries.length; i++) {
            const query = queries[i];
            try {
                await client.query(query);
            } catch (error) {
                // If it is a DROP table error, we can ignore it
                if (!query.toLowerCase().includes('drop table')) {
                    console.error(`Error executing command ${i + 1}:`, error.message);
                    console.error('Statement:', query);
                    throw error;
                }
            }
        }

        console.log('PostgreSQL Database initialized successfully with test data!');
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

initializeDatabase();
