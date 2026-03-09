import { Sidebar } from '@/components/patiorochaleiloes/admin/Sidebar'
import { Header } from '@/components/patiorochaleiloes/admin/Header'

export default function PatioAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-[#ecf0f5] font-sans antialiased text-[#333]">
            {/* Sidebar is fixed width */}
            <div className="hidden md:block flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}
