import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getConnection } from '@/lib/database';
import { verify } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let decoded: any;
        try {
            decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { newPassword } = body;

        if (!newPassword) {
            return NextResponse.json({ error: 'New password is required' }, { status: 400 });
        }

        // Password validation rules
        // Min 7 chars, at least 1 uppercase, at least 1 number, no symbols (alphanumeric only)
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{7,}$/;

        if (!passwordRegex.test(newPassword)) {
            return NextResponse.json({
                error: 'Password must be at least 7 characters long, contain at least one uppercase letter and one number, and must not contain any symbols.'
            }, { status: 400 });
        }

        const connection = await getConnection();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await connection.execute(
            'UPDATE users SET password = ?, must_change_password = FALSE WHERE id = ?',
            [hashedPassword, decoded.userId]
        );

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
