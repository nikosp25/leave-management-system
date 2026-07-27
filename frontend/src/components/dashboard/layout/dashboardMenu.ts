import {
    CalendarPlus,
    ClipboardCheck,
    LayoutDashboard,
    UserCog,
    Users,
    type LucideIcon,
} from 'lucide-react'

export type DashboardNavigationItem = {
    label: string
    path: string
    icon: LucideIcon
    requiredCapability: string | null
    allowedRoles?: string[]
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
        label: 'Manage users',
        path: '/dashboard/manage-users',
        icon: UserCog,
        requiredCapability: 'MANAGE_USERS',
    },
    {
        label: 'Employees',
        path: '/dashboard/employees',
        icon: Users,
        requiredCapability: 'READ_EMPLOYEES',
        allowedRoles: ['MANAGER'],
    },
]