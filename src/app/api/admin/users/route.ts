import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
    try {
        const connection = await getConnection();
        const [users] = await connection.execute(
            'SELECT id, firstName, middleName, lastName, email, idNumber, created_at FROM users ORDER BY created_at DESC'
        );
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, middleName, lastName, idNumber, email } = body;

        if (!firstName || !lastName || !idNumber || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const connection = await getConnection();

        // Check if user exists
        const [existing] = await connection.execute(
            'SELECT id FROM users WHERE email = ? OR idNumber = ?',
            [email, idNumber]
        );

        if (Array.isArray(existing) && existing.length > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const id = randomUUID();
        // Generate 7-character password
        const generatedPassword = Math.random().toString(36).slice(-7);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        await connection.execute(
            'INSERT INTO users (id, firstName, middleName, lastName, idNumber, email, password, must_change_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, firstName, middleName || null, lastName, idNumber, email, hashedPassword, true]
        );

        return NextResponse.json({ message: 'User created', id, password: generatedPassword }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, firstName, middleName, lastName, idNumber, email } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const connection = await getConnection();

        const updates = [];
        const values = [];

        if (firstName) { updates.push('firstName = ?'); values.push(firstName); }
        if (middleName !== undefined) { updates.push('middleName = ?'); values.push(middleName); }
        if (lastName) { updates.push('lastName = ?'); values.push(lastName); }
        if (idNumber) { updates.push('idNumber = ?'); values.push(idNumber); }
        if (email) { updates.push('email = ?'); values.push(email); }

        if (updates.length === 0) {
            return NextResponse.json({ message: 'No updates' });
        }

        values.push(id);

        await connection.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        return NextResponse.json({ message: 'User updated' });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const connection = await getConnection();
        await connection.execute('DELETE FROM users WHERE id = ?', [id]);

        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
