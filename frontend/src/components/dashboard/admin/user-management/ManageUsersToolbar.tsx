import { ChevronDown, Search, X } from 'lucide-react'
import type { UserRoleFilter } from '../../../../services/userApi'

type ManageUsersToolbarProps = {
    searchInput: string
    appliedSearch: string
    roleFilter: UserRoleFilter
    showDeleted: boolean
    canReadDeletedUsers: boolean
    onSearchInputChange: (value: string) => void
    onSearch: () => void
    onClearSearch: () => void
    onRoleFilterChange: (roleName: UserRoleFilter) => void
    onToggleDeletedUsers: () => void
}

function ManageUsersToolbar({
                                searchInput,
                                appliedSearch,
                                roleFilter,
                                showDeleted,
                                canReadDeletedUsers,
                                onSearchInputChange,
                                onSearch,
                                onClearSearch,
                                onRoleFilterChange,
                                onToggleDeletedUsers,
                            }: ManageUsersToolbarProps) {
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
                            onSearchInputChange(event.target.value)
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

                <div className="relative">
                    <select
                        value={roleFilter}
                        onChange={(event) =>
                            onRoleFilterChange(
                                event.target
                                    .value as UserRoleFilter,
                            )
                        }
                        className="cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">All roles</option>
                        <option value="EMPLOYEE">
                            Employees
                        </option>
                        <option value="MANAGER">
                            Managers
                        </option>
                        <option value="ADMIN">Admins</option>
                    </select>

                    <ChevronDown
                        size={17}
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                </div>

                {canReadDeletedUsers && (
                    <button
                        type="button"
                        onClick={onToggleDeletedUsers}
                        className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            showDeleted
                                ? 'border-red-300 bg-red-100 text-red-800 hover:bg-red-200'
                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        {showDeleted
                            ? 'Show active users'
                            : 'Show deleted users'}
                    </button>
                )}
            </form>

            {appliedSearch && (
                <p className="mt-3 text-sm text-slate-500">
                    Showing results for{' '}
                    <span className="font-semibold text-slate-700">
                        “{appliedSearch}”
                    </span>
                </p>
            )}

            {showDeleted && (
                <p className="mt-3 text-sm font-medium text-red-700">
                    Showing deleted users only.
                </p>
            )}
        </>
    )
}

export default ManageUsersToolbar