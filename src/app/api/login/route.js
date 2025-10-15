import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { generateToken } from '@/server/functions/token/token';
import { comparePassword } from '@/server/functions/bcrypt/bcrypt';

export async function POST(request) {
    const { phone, password } = await request.json();
    try{
        console.log('Login attempt for phone:', phone);
        const user = await client.fetch(`*[_type == "resident" && phoneNumber == "${phone}"][0]`);
        console.log('Found user:', user ? 'Yes' : 'No');

        if (!user) {
            return NextResponse.json({ 
                type: 'error',
                success: false,
                message: 'User not found' }, { status: 401 });
        }

        console.log('Comparing password for user:', user._id);
        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json({ 
                type: 'error',
                success: false,
                message: 'Invalid password' }, { status: 401 });
        }

        const token = generateToken(user._id);

        return NextResponse.json({ 
            type: 'success',
            success: true,
            message: 'Login successful' ,
            token,
            data: user,
        },
            { status: 201 });
    }catch(err){
        console.error('Login error:', err);
        return NextResponse.json({ 
            type: 'error',
            success: false,
            message: 'Internal server error' }, { status: 500 });
    }
}
