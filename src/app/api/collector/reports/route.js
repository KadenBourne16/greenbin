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
    try {
        // Get all reports for the collector (if needed in future)
        const reports = await client.fetch(`
            *[_type == "collectorReport"]{
                _id,
                reportID,
                category,
                title,
                description,
                priority,
                status,
                location,
                timestamp,
                collector->{
                    _id,
                    firstName,
                    lastName,
                    collectorID
                }
            }
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
        const { category, title, description, priority, location, collectorId } = body;

        if (!category || !title || !description || !priority || !location || !collectorId) {
            return NextResponse.json({
                success: false,
                error: 'All fields are required'
            }, { status: 400 });
        }

        // Create report in Sanity
        const reportData = {
            _type: 'collectorReport',
            reportID: generate_report_id(),
            category,
            title,
            description,
            priority,
            location,
            status: 'pending',
            timestamp: new Date().toISOString(),
            collector: {
                _type: 'reference',
                _ref: collectorId
            }
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
