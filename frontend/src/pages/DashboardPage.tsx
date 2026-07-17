import AdminDashboard from '../components/dashboard/AdminDashboard'
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard'
import ManagerDashboard from '../components/dashboard/ManagerDashboard'
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