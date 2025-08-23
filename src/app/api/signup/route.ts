import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getConnection, initializeDatabase } from '@/lib/database';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { firstName, lastName, idNumber, email, password } = body;

    // Validate required fields
    if (!firstName || !lastName || !idNumber || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }    // Initialize database and get connection
    await initializeDatabase();
    const connection = await getConnection();

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR idNumber = ?',
      [email, idNumber]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this email or ID number already exists' },
        { status: 409 }
      );
    }    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate unique ID for the user
    const userId = randomUUID();    // Insert new user
    const [result] = await connection.execute(
      `INSERT INTO users (id, firstName, lastName, idNumber, email, password) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, firstName, lastName, idNumber, email, hashedPassword]
    );

    // Return success response (don't include sensitive data)
    return NextResponse.json(
      {
        message: 'User created successfully',        user: {
          id: userId,
          firstName,
          lastName,
          email,
          idNumber
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Duplicate entry')) {
        return NextResponse.json(
          { error: 'User with this email or ID number already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
