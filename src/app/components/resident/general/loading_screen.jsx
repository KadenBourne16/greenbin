export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
            <div className="flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-dashed rounded-full animate-spin border-green-500"></div>
                <p className="ml-2 text-gray-600">Loading... Please wait</p>
            </div>
        </div>
    );
}