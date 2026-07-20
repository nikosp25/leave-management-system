import {
    CalendarPlus,
    LayoutDashboard,
    type LucideIcon,
} from 'lucide-react'

export type DashboardNavigationItem = {
    label: string
    path: string
    icon: LucideIcon
    requiredCapability: string | null
    end?: boolean
}

export const dashboardMenu: DashboardNavigationItem[] = [
    {
        label: 'Overview',
        path: '/dashboard',
        icon: LayoutDashboard,
        requiredCapability: null,
        end: true,
    },
    {
        label: 'Apply for leave',
        path: '/dashboard/apply',
        icon: CalendarPlus,
        requiredCapability: 'CREATE_LEAVE',
    },
]