const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Parse .env file manually since dotenv might not be available in this context
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envConfig = {};

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envConfig[key.trim()] = value.trim();
    }
});

const dbConfig = {
    host: envConfig.DB_HOST,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_DATABASE,
    port: parseInt(envConfig.DB_PORT || '3306'),
};

async function updateSchema() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check if column exists
        const [columns] = await connection.execute(
            "SHOW COLUMNS FROM users LIKE 'must_change_password'"
        );

        if (columns.length === 0) {
            console.log('Adding must_change_password column...');
            await connection.execute(
                "ALTER TABLE users ADD COLUMN must_change_password BOOLEAN DEFAULT TRUE"
            );
            console.log('Column added successfully.');
        } else {
            console.log('Column must_change_password already exists.');
        }

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
