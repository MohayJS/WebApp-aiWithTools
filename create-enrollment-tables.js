const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Parse .env file manually
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

async function createTables() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const queries = [
            `CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(20) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                units INT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS sections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                course_id INT NOT NULL,
                section_code VARCHAR(10) NOT NULL,
                schedule VARCHAR(100) NOT NULL,
                room VARCHAR(50),
                capacity INT NOT NULL,
                enrolled_count INT DEFAULT 0,
                FOREIGN KEY (course_id) REFERENCES courses(id)
            )`,
            `CREATE TABLE IF NOT EXISTS enrollments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(255) NOT NULL,
                section_id INT NOT NULL,
                status ENUM('enrolled', 'dropped') DEFAULT 'enrolled',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES users(id),
                FOREIGN KEY (section_id) REFERENCES sections(id)
            )`,
            `CREATE TABLE IF NOT EXISTS prerequisites (
                course_id INT NOT NULL,
                prerequisite_course_id INT NOT NULL,
                PRIMARY KEY (course_id, prerequisite_course_id),
                FOREIGN KEY (course_id) REFERENCES courses(id),
                FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id)
            )`
        ];

        for (const query of queries) {
            await connection.execute(query);
            console.log('Executed query successfully.');
        }

        console.log('All tables created successfully.');

        // Insert dummy data if empty
        const [courses] = await connection.execute('SELECT count(*) as count FROM courses');
        if (courses[0].count === 0) {
            console.log('Seeding dummy data...');

            // Insert Courses
            await connection.execute(`
                INSERT INTO courses (code, title, description, units) VALUES 
                ('CS101', 'Introduction to Computing', 'Basic concepts of computing and programming.', 3),
                ('CS102', 'Data Structures', 'Arrays, lists, stacks, queues, trees, graphs.', 3),
                ('MATH101', 'Calculus I', 'Limits, continuity, derivatives, integrals.', 5),
                ('ENG101', 'Purposive Communication', 'Writing, speaking, and presenting for various audiences.', 3)
            `);

            // Get Course IDs
            const [courseRows] = await connection.execute('SELECT id, code FROM courses');
            const courseMap = {};
            courseRows.forEach(c => courseMap[c.code] = c.id);

            // Insert Sections
            await connection.execute(`
                INSERT INTO sections (course_id, section_code, schedule, room, capacity) VALUES 
                (?, 'A', 'MWF 09:00-10:00', 'RM101', 30),
                (?, 'B', 'TTH 10:30-12:00', 'RM102', 30),
                (?, 'A', 'MWF 13:00-14:00', 'RM103', 30),
                (?, 'A', 'MWF 10:00-11:00', 'RM104', 40),
                (?, 'A', 'TTH 13:00-14:30', 'RM105', 35)
            `, [
                courseMap['CS101'],
                courseMap['CS101'],
                courseMap['CS102'],
                courseMap['MATH101'],
                courseMap['ENG101']
            ]);

            // Insert Prerequisites
            await connection.execute(`
                INSERT INTO prerequisites (course_id, prerequisite_course_id) VALUES 
                (?, ?)
            `, [courseMap['CS102'], courseMap['CS101']]);

            console.log('Dummy data seeded.');
        }

    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        if (connection) await connection.end();
    }
}

createTables();
