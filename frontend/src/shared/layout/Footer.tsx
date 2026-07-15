function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-slate-700 bg-slate-900">
            <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white">
                        LM
                    </div>

                    <span className="text-sm font-semibold text-white">
            Leave Management
          </span>
                </div>

                <p className="text-sm text-slate-400">
                    © {currentYear} Leave Management System
                </p>
            </div>
        </footer>
    )
}

export default Footer