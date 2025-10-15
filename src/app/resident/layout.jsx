import Sidebar from "@/app/components/resident/general/sidebar";

export default function ResidentLayout({ children }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1">{children}</main>
        </div>
    );
}