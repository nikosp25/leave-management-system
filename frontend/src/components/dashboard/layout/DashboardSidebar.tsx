import { NavLink } from 'react-router'
import { useAuth } from '../../../hooks/useAuth'
import { dashboardMenu } from './dashboardMenu'

function DashboardSidebar() {
    const { currentUser } = useAuth()

    if (!currentUser) {
        return null
    }

    const visibleMenuItems = dashboardMenu.filter(
        (menuItem) => {
            if (menuItem.requiredCapability === null) {
                return true
            }

            return currentUser.capabilities.includes(
                menuItem.requiredCapability,
            )
        },
    )

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
                {visibleMenuItems.map((menuItem) => {
                    const Icon = menuItem.icon

                    return (
                        <NavLink
                            key={menuItem.path}
                            to={menuItem.path}
                            end={menuItem.end}
                            className={({ isActive }) =>
                                getLinkClasses(isActive)
                            }
                        >
                            <Icon
                                size={20}
                                aria-hidden="true"
                            />

                            {menuItem.label}
                        </NavLink>
                    )
                })}
            </nav>
        </aside>
    )
}

export default DashboardSidebar