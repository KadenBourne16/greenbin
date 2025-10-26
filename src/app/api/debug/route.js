import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET() {
    try {
        // Test basic connection
        const totalResidents = await client.fetch('count(*[_type == "resident"])');
        const sampleResident = await client.fetch('*[_type == "resident"][0]');

        return NextResponse.json({
            success: true,
            totalResidents,
            sampleResident: sampleResident ? {
                _id: sampleResident._id,
                firstName: sampleResident.firstName,
                phoneNumber: sampleResident.phoneNumber,
                accountStatus: sampleResident.accountStatus
            } : null,
            environment: {
                projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'Set' : 'Missing',
                dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ? 'Set' : 'Missing',
                token: process.env.NEXT_SANITY_TOKEN ? 'Set' : 'Missing',
                jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Missing'
            }
        });
    } catch (error) {
        console.error('Debug route error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
