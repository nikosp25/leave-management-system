type NavigationItem = {
    label: string
    href: string
}

type HeaderUser = {
    firstName: string
    lastName: string
    role: string
}

type HeaderProps = {
    isAuthenticated: boolean
    navigationItems?: NavigationItem[]
    user?: HeaderUser
    onLogout?: () => void
}

function Header({
                    isAuthenticated,
                    navigationItems = [],
                    user,
                    onLogout,
                }: HeaderProps) {
    const initials = user
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
        : ''

    return (
        <header className="border-b border-slate-700 bg-slate-900 shadow-md">
            <div
                className={`mx-auto flex h-16 max-w-7xl items-center px-6 ${
                    isAuthenticated ? 'justify-between' : 'justify-center'
                }`}
            >
                <a href="/" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">
                        LM
                    </div>

                    <span className="text-lg font-semibold text-white">
            Leave Management
          </span>
                </a>

                {isAuthenticated && (
                    <>
                        <nav className="flex items-center gap-8">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4">
                            {user && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-300">
                                        {initials}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {user.firstName} {user.lastName}
                                        </p>

                                        <p className="text-xs capitalize text-slate-400">
                                            {user.role.toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={onLogout}
                                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header