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
    console.log('Could not read .env file, using defaults');
}

const dbConfig = {
    host: env.DB_HOST || '127.0.0.1',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'Ngick13@',
    database: env.DB_DATABASE || 'msuenrollment',
    port: parseInt(env.DB_PORT || '3306'),
};

async function initDb() {
    try {
        console.log('Connecting to database...');
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        middleName VARCHAR(100),
        lastName VARCHAR(100) NOT NULL,
        idNumber INT UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

        await connection.execute(createUsersTable);
        console.log('Users table initialized successfully.');

        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDb();
