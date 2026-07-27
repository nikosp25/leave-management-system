import { Pencil, Trash2 } from 'lucide-react'
import type { CurrentUser } from '../../../../types/User'
import type {
    ManagedUserSortField,
    SortDirection,
} from '../../../../services/userApi'

type ManageUsersTableProps = {
    users: CurrentUser[]
    sortField: ManagedUserSortField
    sortDirection: SortDirection
    showDeleted: boolean
    currentUserUuid: string
    processingUserUuid: string | null
    onSort: (field: ManagedUserSortField) => void
    onEdit: (userUuid: string) => void
    onDelete: (user: CurrentUser) => void
}

function ManageUsersTable({
                              users,
                              sortField,
                              sortDirection,
                              showDeleted,
                              currentUserUuid,
                              processingUserUuid,
                              onSort,
                              onEdit,
                              onDelete,
                          }: ManageUsersTableProps) {
    function getSortIcon(field: ManagedUserSortField) {
        if (sortField !== field) {
            return '↕'
        }

        return sortDirection === 'asc' ? '↑' : '↓'
    }

    function formatRole(roleName: string) {
        return roleName
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase(),
            )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-900">
                <tr>
                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() => onSort('firstName')}
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            First name
                            <span aria-hidden="true">
                                    {getSortIcon('firstName')}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() => onSort('lastName')}
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Last name
                            <span aria-hidden="true">
                                    {getSortIcon('lastName')}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() => onSort('email')}
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Email
                            <span aria-hidden="true">
                                    {getSortIcon('email')}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        Role
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() =>
                                onSort('availableLeaveDays')
                            }
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Available days
                            <span aria-hidden="true">
                                    {getSortIcon(
                                        'availableLeaveDays',
                                    )}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        Status
                    </th>

                    <th className="px-3 py-3 text-right font-semibold">
                        Actions
                    </th>
                </tr>
                </thead>

                <tbody>
                {users.map((user) => {
                    const isCurrentUser =
                        user.uuid === currentUserUuid

                    const isProcessing =
                        processingUserUuid === user.uuid

                    return (
                        <tr
                            key={user.uuid}
                            className="border-b border-slate-100"
                        >
                            <td className="px-3 py-4 font-medium text-slate-900">
                                {user.firstName}
                            </td>

                            <td className="px-3 py-4">
                                {user.lastName}
                            </td>

                            <td className="px-3 py-4 text-slate-600">
                                {user.email}
                            </td>

                            <td className="px-3 py-4">
                                {formatRole(user.roleName)}
                            </td>

                            <td className="px-3 py-4">
                                {user.availableLeaveDays}
                            </td>

                            <td className="px-3 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                            showDeleted
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}
                                    >
                                        {showDeleted
                                            ? 'Deleted'
                                            : 'Active'}
                                    </span>
                            </td>

                            <td className="px-3 py-4">
                                {showDeleted ? (
                                    <p className="text-right text-slate-400">
                                        —
                                    </p>
                                ) : (
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onEdit(user.uuid)
                                            }
                                            disabled={
                                                processingUserUuid !==
                                                null
                                            }
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Pencil
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDelete(user)
                                            }
                                            disabled={
                                                isCurrentUser ||
                                                processingUserUuid !==
                                                null
                                            }
                                            title={
                                                isCurrentUser
                                                    ? 'You cannot delete your own account'
                                                    : 'Delete user'
                                            }
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            {isProcessing
                                                ? 'Deleting...'
                                                : 'Delete'}
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default ManageUsersTable