import {
    CalendarPlus,
    LayoutDashboard,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { useAuth } from '../../../hooks/useAuth'

function DashboardSidebar() {
    const { currentUser } = useAuth()

    if (!currentUser) {
        return null
    }

    const canCreateLeave =
        currentUser.capabilities.includes('CREATE_LEAVE')

    function getLinkClasses(isActive: boolean) {
        return `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
            isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
        }`
    }

    return (
        <aside className="w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Menu
            </p>

            <nav className="mt-3 space-y-1">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        getLinkClasses(isActive)
                    }
                >
                    <LayoutDashboard
                        size={20}
                        aria-hidden="true"
                    />

                    Overview
                </NavLink>

                {canCreateLeave && (
                    <NavLink
                        to="/dashboard/apply"
                        className={({ isActive }) =>
                            getLinkClasses(isActive)
                        }
                    >
                        <CalendarPlus
                            size={20}
                            aria-hidden="true"
                        />

                        Apply for leave
                    </NavLink>
                )}
            </nav>
        </aside>
    )
}

export default DashboardSidebar