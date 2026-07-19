import { Outlet } from 'react-router'
import DashboardSidebar from './DashboardSidebar'

function DashboardLayout() {
    return (
        <div className="relative left-1/2 flex w-screen -translate-x-1/2 items-start gap-6 px-6">
            <DashboardSidebar />

            <main className="min-w-0 flex-1">
                <div className="max-w-6xl">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout