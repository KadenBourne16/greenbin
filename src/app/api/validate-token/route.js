import { NextResponse } from 'next/server';
import { verifyToken } from '@/server/functions/token/token';

export async function POST(request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({
                type: 'error',
                success: false,
                message: 'Token is required'
            }, { status: 400 });
        }

        const isValid = await verifyToken(token);

        if (!isValid) {
            return NextResponse.json({
                type: 'error',
                success: false,
                message: 'Invalid token'
            }, { status: 401 });
        }

        return NextResponse.json({
            type: 'success',
            success: true,
            message: 'Token is valid'
        });

    } catch (error) {
        console.error('Error validating token:', error);
        return NextResponse.json({
            type: 'error',
            success: false,
            message: 'Failed to validate token'
        }, { status: 500 });
    }
}
