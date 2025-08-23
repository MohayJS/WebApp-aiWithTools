import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getConnection, initializeDatabase } from '@/lib/database';
import { sign } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // Initialize database and get connection
    await initializeDatabase();
    const connection = await getConnection();

    // Find user by email
    const [users] = await connection.execute(
      'SELECT id, firstName, lastName, email, idNumber, password FROM users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0] as any;

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token (you might want to add JWT_SECRET to your environment variables)
    const token = sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return success response (don't include password)
    return NextResponse.json(
      {
        message: 'Sign in successful',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          idNumber: user.idNumber
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
