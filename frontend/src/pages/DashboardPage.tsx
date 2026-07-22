import AdminDashboard from '../components/dashboard/admin/AdminDashboard'
import EmployeeDashboard from '../components/dashboard/employee/EmployeeDashboard'
import ManagerDashboard from '../components/dashboard/management/ManagerDashboard'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
    const { currentUser } = useAuth()

    if (!currentUser) {
        return null
    }

    switch (currentUser.roleName) {
        case 'ADMIN':
            return <AdminDashboard />

        case 'MANAGER':
            return <ManagerDashboard />

        case 'EMPLOYEE':
            return <EmployeeDashboard />

        default:
            return <p>Unknown user role</p>
    }
}

export default DashboardPage