import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getConnection, initializeDatabase } from '@/lib/database';
import { sign } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { identifier, password } = body;

    // Validate required fields
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/ID and password are required' },
        { status: 400 }
      );
    }

    // Initialize database and get connection
    await initializeDatabase();
    const connection = await getConnection();

    // Find user by email OR idNumber
    // We check if identifier looks like an email or a number
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    let query = 'SELECT id, firstName, lastName, email, idNumber, password, must_change_password FROM users WHERE ';
    let params = [];

    if (isEmail) {
      query += 'email = ?';
      params.push(identifier);
    } else {
      // Assume it's an ID number
      query += 'idNumber = ?';
      params.push(identifier);
    }

    const [users] = await connection.execute(query, params);

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0] as any;

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return success response
    return NextResponse.json(
      {
        message: 'Sign in successful',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          idNumber: user.idNumber,
          mustChangePassword: !!user.must_change_password
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Sign in error:', error);

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
