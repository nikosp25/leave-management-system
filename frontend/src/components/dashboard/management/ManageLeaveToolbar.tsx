import { Search, X } from 'lucide-react'

type ManageLeaveToolbarProps = {
    searchInput: string
    appliedSearch: string
    showPendingOnly: boolean
    showApprovedOnly: boolean
    onSearchInputChange: (value: string) => void
    onSearch: () => void
    onClearSearch: () => void
    onTogglePendingOnly: () => void
    onToggleApprovedOnly: () => void
}

function ManageLeaveToolbar({
                                searchInput,
                                appliedSearch,
                                showPendingOnly,
                                showApprovedOnly,
                                onSearchInputChange,
                                onSearch,
                                onClearSearch,
                                onTogglePendingOnly,
                                onToggleApprovedOnly,
                            }: ManageLeaveToolbarProps) {
    return (
        <>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    onSearch()
                }}
                className="mt-5 flex flex-wrap gap-2"
            >
                <div className="relative min-w-64 flex-1">
                    <Search
                        size={18}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="search"
                        value={searchInput}
                        onChange={(event) =>
                            onSearchInputChange(
                                event.target.value,
                            )
                        }
                        placeholder="Search by name or email"
                        className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <button
                    type="submit"
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                    Search
                </button>

                {appliedSearch && (
                    <button
                        type="button"
                        onClick={onClearSearch}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                        <X size={17} aria-hidden="true" />
                        Clear
                    </button>
                )}

                <button
                    type="button"
                    onClick={onTogglePendingOnly}
                    className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        showPendingOnly
                            ? 'border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    {showPendingOnly
                        ? 'Show all requests'
                        : 'Show only pending'}
                </button>

                <button
                    type="button"
                    onClick={onToggleApprovedOnly}
                    className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        showApprovedOnly
                            ? 'border-green-300 bg-green-100 text-green-800 hover:bg-green-200'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    {showApprovedOnly
                        ? 'Show all requests'
                        : 'Show only approved'}
                </button>
            </form>

            {appliedSearch &&
                !showPendingOnly &&
                !showApprovedOnly && (
                    <p className="mt-3 text-sm text-slate-500">
                        Showing results for{' '}
                        <span className="font-semibold text-slate-700">
                            “{appliedSearch}”
                        </span>
                    </p>
                )}

            {showPendingOnly && (
                <p className="mt-3 text-sm font-medium text-amber-700">
                    Showing pending requests only.
                </p>
            )}

            {showApprovedOnly && (
                <p className="mt-3 text-sm font-medium text-green-700">
                    Showing approved requests only.
                </p>
            )}
        </>
    )
}

export default ManageLeaveToolbar