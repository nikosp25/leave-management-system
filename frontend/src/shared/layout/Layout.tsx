import type { ComponentProps } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import Header from './Header'
import Footer from './Footer'

type LayoutProps = ComponentProps<typeof Header>

function Layout(headerProps: LayoutProps) {
    const { setCurrentUser } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        try {
            const response = await fetch(
                'http://localhost:8080/api/v1/auth/logout',
                {
                    method: 'POST',
                    credentials: 'include',
                    signal: AbortSignal.timeout(7_000),
                },
            )

            if (!response.ok) {
                throw new Error('Could not log out')
            }

            setCurrentUser(null)
            navigate('/')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }
    return (
        <div className="flex min-h-screen flex-col bg-slate-300">
            <Header
                {...headerProps}
                onLogout={handleLogout}
            />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default Layout