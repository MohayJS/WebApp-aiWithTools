const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

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

async function debugUserCreation() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // Check table schema
        console.log('Checking users table schema...');
        const [columns] = await connection.execute('SHOW COLUMNS FROM users');
        console.log('Columns:', columns.map(c => c.Field).join(', '));

        // Try inserting a user
        console.log('Attempting to insert a test user...');
        const id = randomUUID();
        const firstName = 'Test';
        const middleName = 'Debug';
        const lastName = 'User';
        const idNumber = Math.floor(Math.random() * 1000000);
        const email = `test${idNumber}@example.com`;
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            'INSERT INTO users (id, firstName, middleName, lastName, idNumber, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, firstName, middleName, lastName, idNumber, email, hashedPassword]
        );
        console.log('User inserted successfully.');

        // Clean up
        await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        console.log('Test user deleted.');

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        if (connection) await connection.end();
    }
}

debugUserCreation();
