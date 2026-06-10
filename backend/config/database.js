const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Construct connection URL if not provided directly
let connectionString = process.env.DATABASE_URL;
if (!connectionString && process.env.DB_HOST) {
    const user = process.env.DB_USER || 'postgres';
    const password = process.env.DB_PASSWORD || '';
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 5432;
    const database = process.env.DB_NAME || 'papelaria_amor_arte';
    connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

console.log('Initializing PostgreSQL Connection Pool...');

const pgPool = new Pool({
    connectionString: connectionString,
    // Enable SSL if it's an external connection (like connecting from your PC to Render)
    ssl: connectionString && (connectionString.includes('render.com') || connectionString.includes('aivencloud.com') || process.env.NODE_ENV === 'production') 
        ? { rejectUnauthorized: false } 
        : false
});

// Helper function to translate MySQL SQL to PostgreSQL SQL
function translateSql(sql, values = []) {
    let count = 0;
    // Replace MySQL "?" parameter markers with PostgreSQL "$1", "$2" etc.
    let pgSql = sql.replace(/\?/g, () => {
        count++;
        return `$${count}`;
    });

    // Replace double quotes used for strings with single quotes
    pgSql = pgSql.replace(/"/g, "'");

    // Replace MySQL JSON functions with PostgreSQL equivalents
    pgSql = pgSql.replace(/JSON_ARRAYAGG/gi, 'json_agg');
    pgSql = pgSql.replace(/JSON_OBJECT/gi, 'json_build_object');

    // For INSERT queries, append RETURNING id to easily fetch insertId
    const trimmed = pgSql.trim().toLowerCase();
    if (trimmed.startsWith('insert') && !trimmed.includes('returning')) {
        // Find if we insert into products, users, categories, product_images, orders, order_items
        // All of these have 'id' as serial primary key
        pgSql += ' RETURNING id';
    }

    return pgSql;
}

// Function that emulates the behavior of mysql2 pool.query
async function executePgQuery(clientOrPool, sql, values = []) {
    const pgSql = translateSql(sql, values);
    
    try {
        const result = await clientOrPool.query(pgSql, values);
        const rows = result.rows;
        
        // Emulate mysql2 result format
        const mockResult = {
            affectedRows: result.rowCount || 0,
            insertId: rows[0] && rows[0].id ? parseInt(rows[0].id) : null,
            warningStatus: 0
        };

        const isSelect = sql.trim().toLowerCase().startsWith('select');
        if (isSelect) {
            return [rows, null];
        } else {
            // mysql2 returns the write result object for INSERT/UPDATE/DELETE
            return [mockResult, null];
        }
    } catch (error) {
        console.error('Database Query Error:', error.message);
        console.error('Original SQL:', sql);
        console.error('Converted SQL:', pgSql);
        throw error;
    }
}

// Test database connection
pgPool.connect()
    .then(client => {
        console.log('Database connected successfully (PostgreSQL)');
        client.release();
    })
    .catch(error => {
        console.error('Database connection failed (PostgreSQL):', error.message);
    });

const poolWrapper = {
    query: (sql, values) => executePgQuery(pgPool, sql, values),
    
    getConnection: async () => {
        const client = await pgPool.connect();
        
        // Return a wrapper that behaves like a mysql2 connection object
        const connection = {
            query: (sql, values) => executePgQuery(client, sql, values),
            beginTransaction: async () => {
                await client.query('BEGIN');
            },
            commit: async () => {
                await client.query('COMMIT');
            },
            rollback: async () => {
                await client.query('ROLLBACK');
            },
            release: () => {
                client.release();
            }
        };
        return connection;
    },
    
    end: () => pgPool.end()
};

module.exports = poolWrapper;
