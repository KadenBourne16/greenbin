import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { generateToken } from '@/server/functions/token/token';
import { comparePassword } from '@/server/functions/bcrypt/bcrypt';

export async function POST(request) {
    const { phone, password, collectorID } = await request.json();
    try {
        // Query for waste collector by phone and collectorID
        const collector = await client.fetch(
            `*[_type == "wasteCollector" && contactNumber == "${phone}" && collectorID == "${collectorID}"][0]`
        );

        if (!collector) {
            return NextResponse.json({
                type: 'error',
                success: false,
                message: 'Waste collector not found'
            }, { status: 401 });
        }

        const isPasswordValid = await comparePassword(password, collector.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json({
                type: 'error',
                success: false,
                message: 'Invalid password'
            }, { status: 401 });
        }

        const token = generateToken(collector._id);

        return NextResponse.json({
            type: 'success',
            success: true,
            message: 'Login successful',
            token,
            data: collector,
        }, { status: 200 });
    } catch (err) {
        console.error('Collector login error:', err);
        return NextResponse.json({
            type: 'error',
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}
