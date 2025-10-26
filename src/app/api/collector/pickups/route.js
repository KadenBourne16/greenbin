import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request) {
    try {
        // Get all waste requests with resident and collector information
        const wasteRequests = await client.fetch(`
            *[_type == "wasteRequest"]{
                _id,
                requestID,
                wasteType,
                pickupDate,
                status,
                location,
                remarks,
                requestTimestamp,
                resident->{
                    _id,
                    firstName,
                    lastName,
                    email,
                    phone,
                    address
                },
                collector->{
                    _id,
                    firstName,
                    lastName,
                    collectorID
                }
            }
        `);

        // Transform the data to match the format expected by the frontend
        const transformedRequests = wasteRequests.map(req => ({
            id: req._id,
            requestID: req.requestID,
            wasteType: req.wasteType,
            pickupDate: req.pickupDate,
            status: req.status,
            location: req.location,
            remarks: req.remarks,
            requestTimestamp: req.requestTimestamp,
            resident: req.resident ? {
                id: req.resident._id,
                name: `${req.resident.firstName} ${req.resident.lastName}`,
                email: req.resident.email,
                phone: req.resident.phone,
                address: req.resident.address
            } : null,
            collector: req.collector ? {
                id: req.collector._id,
                name: `${req.collector.firstName} ${req.collector.lastName}`,
                collectorID: req.collector.collectorID
            } : null
        }));

        return NextResponse.json({
            success: true,
            wasteRequests: transformedRequests
        });

    } catch (error) {
        console.error('Error fetching pickup requests:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch pickup requests'
        }, { status: 500 });
    }
}
