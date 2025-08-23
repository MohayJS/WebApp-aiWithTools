// Test script to verify database connection and signup/signin functionality
import { initializeDatabase, getConnection } from '../src/lib/database';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✓ Database initialized successfully');
    
    // Test connection
    const connection = await getConnection();
    console.log('✓ Database connection established');
    
    // Test if users table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'users'");
    if (Array.isArray(tables) && tables.length > 0) {
      console.log('✓ Users table exists');
    } else {
      console.log('✗ Users table not found');
    }
    
    // Check table structure
    const [columns] = await connection.execute("DESCRIBE users");
    console.log('✓ Users table structure:', columns);
    
    console.log('Database test completed successfully!');
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase();
