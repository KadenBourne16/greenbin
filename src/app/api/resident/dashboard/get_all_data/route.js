import {NextResponse} from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request) {
    const { nextUrl } = request;
    const resident_id = nextUrl.searchParams.get('resident_id');

    if (!resident_id) {
        return NextResponse.json({ error: 'resident_id is required' }, { status: 400 });
    }

    try {
        // Get resident data
        const resident = await client.fetch(`*[_type == "resident" && _id == "${resident_id}"][0]`);

        // Get waste requests for this resident
        const wasteRequests = await client.fetch(`*[_type == "wasteRequest" && resident._ref == "${resident_id}"]`);

        // Get resident's bin information (if bins are linked to residents)
        // const bins = await client.fetch(`*[_type == "bin" && resident._ref == "${resident_id}"]`);

        return NextResponse.json({
            resident,
            wasteRequests,
            // bins
        });
    } catch (error) {
        console.error('Error fetching resident data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
