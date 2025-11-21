const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let env = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.log('Could not read .env file, using process.env or defaults');
}

const dbConfig = {
    host: env.DB_HOST || '127.0.0.1',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'Ngick13@',
    database: env.DB_DATABASE || 'msuenrollment',
    port: parseInt(env.DB_PORT || '3306'),
};

async function testConnection() {
    try {
        console.log('Connecting to database with config:', { ...dbConfig, password: '***' });
        const connection = await mysql.createConnection(dbConfig);
        console.log('Successfully connected to the database.');

        const [rows] = await connection.execute("SHOW TABLES LIKE 'users'");
        if (rows.length > 0) {
            console.log('Users table exists.');
        } else {
            console.log('Users table does NOT exist.');
        }

        await connection.end();
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

testConnection();
