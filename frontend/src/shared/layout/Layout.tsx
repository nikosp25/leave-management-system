import type { ComponentProps } from 'react'
import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'

type LayoutProps = ComponentProps<typeof Header>

function Layout(headerProps: LayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-300">
            <Header {...headerProps} />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default Layout