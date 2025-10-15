"use client"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function UnderDevelopment() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
            <div className="text-center">
                <div className="mb-4 w-full h-12 flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Page Under Development</h1>
                <p className="text-sm text-gray-600">This page is currently under development. Please try again later.</p>
            </div>
        </div>
    );
}
