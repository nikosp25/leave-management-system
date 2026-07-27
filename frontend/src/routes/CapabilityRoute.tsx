import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

type CapabilityRouteProps = {
    requiredCapability: string
}

function CapabilityRoute({
                             requiredCapability,
                         }: CapabilityRouteProps) {
    const { currentUser, isAuthLoading } = useAuth()

    if (isAuthLoading) {
        return <p>Loading...</p>
    }

    if (!currentUser) {
        return <Navigate to="/" replace />
    }

    const hasRequiredCapability =
        currentUser.capabilities.includes(
            requiredCapability,
        )

    if (!hasRequiredCapability) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

export default CapabilityRoute