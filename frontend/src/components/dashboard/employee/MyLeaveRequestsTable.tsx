import type { LeaveRequest } from '../../../types/LeaveRequest'
import type {
    SortDirection,
    UserLeaveSortField,
} from '../../../services/leaveRequestApi'
import CancelLeaveButton from './CancelLeaveButton'

type MyLeaveRequestsTableProps = {
    leaveRequests: LeaveRequest[]
    sortField: UserLeaveSortField
    sortDirection: SortDirection
    canCancelOwnLeave: boolean
    onSort: (field: UserLeaveSortField) => void
    onCancelled: () => void
    onError: (message: string) => void
}

function MyLeaveRequestsTable({
                                  leaveRequests,
                                  sortField,
                                  sortDirection,
                                  canCancelOwnLeave,
                                  onSort,
                                  onCancelled,
                                  onError,
                              }: MyLeaveRequestsTableProps) {
    function getStatusClasses(status: string) {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-700'

            case 'REJECTED':
                return 'bg-red-100 text-red-700'

            case 'PENDING':
                return 'bg-amber-100 text-amber-700'

            case 'CANCELLED':
                return 'bg-slate-200 text-slate-700'

            default:
                return 'bg-slate-100 text-slate-700'
        }
    }

    function formatName(name: string) {
        return name
            .toLowerCase()
            .replaceAll('_', ' ')
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase(),
            )
    }

    function getSortIcon(
        field: UserLeaveSortField,
    ) {
        if (sortField !== field) {
            return '↕'
        }

        return sortDirection === 'asc' ? '↑' : '↓'
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-900">
                <tr>
                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() =>
                                onSort('leaveType.name')
                            }
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Leave type

                            <span aria-hidden="true">
                                    {getSortIcon(
                                        'leaveType.name',
                                    )}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() =>
                                onSort('startDate')
                            }
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Start date

                            <span aria-hidden="true">
                                    {getSortIcon('startDate')}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() =>
                                onSort('endDate')
                            }
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            End date

                            <span aria-hidden="true">
                                    {getSortIcon('endDate')}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() =>
                                onSort(
                                    'leaveStatus.name',
                                )
                            }
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Status

                            <span aria-hidden="true">
                                    {getSortIcon(
                                        'leaveStatus.name',
                                    )}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        Manager comment
                    </th>

                    <th className="px-3 py-3 text-right font-semibold">
                        Actions
                    </th>
                </tr>
                </thead>

                <tbody>
                {leaveRequests.map((request) => (
                    <tr
                        key={request.uuid}
                        className="border-b border-slate-100"
                    >
                        <td className="px-3 py-4">
                            {formatName(
                                request.leaveTypeName,
                            )}
                        </td>

                        <td className="px-3 py-4">
                            {request.startDate}
                        </td>

                        <td className="px-3 py-4">
                            {request.endDate}
                        </td>

                        <td className="px-3 py-4">
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                        request.leaveStatusName,
                                    )}`}
                                >
                                    {formatName(
                                        request.leaveStatusName,
                                    )}
                                </span>
                        </td>

                        <td className="px-3 py-4">
                            {request.managerComment ??
                                '—'}
                        </td>

                        <td className="px-3 py-4 text-right">
                            {request.leaveStatusName ===
                            'PENDING' &&
                            canCancelOwnLeave ? (
                                <CancelLeaveButton
                                    leaveRequestUuid={
                                        request.uuid
                                    }
                                    onCancelled={
                                        onCancelled
                                    }
                                    onError={onError}
                                />
                            ) : (
                                <span className="text-slate-400">
                                        —
                                    </span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default MyLeaveRequestsTable