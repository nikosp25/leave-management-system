import {
    CalendarPlus,
    ClipboardCheck,
    LayoutDashboard,
    Users,
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
    {
        label: 'Manage leave',
        path: '/dashboard/manage-leave',
        icon: ClipboardCheck,
        requiredCapability: 'READ_ALL_LEAVE',
    },
    {
        label: 'Employees',
        path: '/dashboard/employees',
        icon: Users,
        requiredCapability: 'READ_EMPLOYEES',
    },
]