import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute() {
    const { currentUser, isAuthLoading } = useAuth()

    if (isAuthLoading) {
        return <p>Loading...</p>
    }

    if (!currentUser) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute