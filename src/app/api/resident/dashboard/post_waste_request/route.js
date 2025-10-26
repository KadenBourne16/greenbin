import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(request) {
    try {
        const { wasteType, pickupDate, location, remarks, residentId } = await request.json();

        // Validate required fields
        if (!wasteType || !pickupDate || !location || !residentId) {
            return NextResponse.json({
                error: 'Missing required fields: wasteType, pickupDate, location, and residentId are required'
            }, { status: 400 });
        }

        // Validate wasteType against allowed values from schema
        const allowedWasteTypes = ['household', 'recyclable', 'commercial'];
        if (!allowedWasteTypes.includes(wasteType)) {
            return NextResponse.json({
                error: 'Invalid wasteType. Must be one of: household, recyclable, commercial'
            }, { status: 400 });
        }

        // Generate request ID (matches the schema's initialValue function)
        const generateRequestId = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let requestId = '';
            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                requestId += characters.charAt(randomIndex);
            }
            return requestId;
        };

        const newRequest = {
            _type: 'wasteRequest',
            requestID: generateRequestId(),
            resident: {
                _type: 'reference',
                _ref: residentId
            },
            wasteType,
            pickupDate,
            status: 'pending', // Default status for new requests
            requestTimestamp: new Date().toISOString(),
            location,
            remarks: remarks || '', // Handle optional remarks field
        };

        const result = await client.create(newRequest);

        return NextResponse.json({
            message: 'Waste request created successfully',
            data: result,
            success: true
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating waste request:', error);
        return NextResponse.json({
            error: 'Failed to create waste request',
            details: error.message
        }, { status: 500 });
    }
}
