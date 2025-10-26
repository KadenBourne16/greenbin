import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

const generate_report_id = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reportId = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        reportId += characters.charAt(randomIndex);
    }
    return reportId;
}

export async function GET(request) {
    const { nextUrl } = request;
    const resident_id = nextUrl.searchParams.get('resident_id');

    if (!resident_id) {
        return NextResponse.json({ error: 'resident_id is required' }, { status: 400 });
    }

    try {
        // Get all reports for this resident
        const reports = await client.fetch(`
            *[_type == "residentReport" && resident._ref == "${resident_id}"]{
                _id,
                reportID,
                category,
                title,
                description,
                priority,
                status,
                location,
                timestamp,
                response
            } | order(timestamp desc)
        `);

        return NextResponse.json({
            success: true,
            reports: reports
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch reports'
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { category, title, description, priority, location, residentId } = body;

        if (!category || !title || !description || !priority || !location || !residentId) {
            return NextResponse.json({
                success: false,
                error: 'All fields are required'
            }, { status: 400 });
        }

        // Create report in Sanity
        const reportData = {
            _type: 'residentReport',
            reportID: generate_report_id(),
            category,
            title,
            description,
            priority,
            location,
            status: 'pending',
            timestamp: new Date().toISOString(),
            resident: {
                _type: 'reference',
                _ref: residentId
            },
            response: null
        };

        const result = await client.create(reportData);

        return NextResponse.json({
            success: true,
            report: result
        });

    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create report'
        }, { status: 500 });
    }
}
