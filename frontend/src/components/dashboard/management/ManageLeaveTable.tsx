import type { LeaveRequest } from '../../../types/LeaveRequest'
import LeaveActionButton from './LeaveActionButton'

export type SortField =
    | 'user.lastName'
    | 'leaveType.name'
    | 'startDate'
    | 'endDate'
    | 'leaveStatus.name'

export type SortDirection = 'asc' | 'desc'

type ManageLeaveTableProps = {
    leaveRequests: LeaveRequest[]
    sortField: SortField
    sortDirection: SortDirection
    processingRequestUuid: string | null
    onSort: (field: SortField) => void
    onApprove: (requestUuid: string) => void
    onReject: (requestUuid: string) => void
    onCancel: (requestUuid: string) => void
}

function ManageLeaveTable({
                              leaveRequests,
                              sortField,
                              sortDirection,
                              processingRequestUuid,
                              onSort,
                              onApprove,
                              onReject,
                              onCancel,
                          }: ManageLeaveTableProps) {
    function getSortIcon(field: SortField) {
        if (sortField !== field) {
            return '↕'
        }

        return sortDirection === 'asc' ? '↑' : '↓'
    }

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

    function isFutureDate(date: string) {
        const [year, month, day] = date
            .split('-')
            .map(Number)

        const leaveStartDate = new Date(
            year,
            month - 1,
            day,
        )

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return leaveStartDate > today
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
                                onSort('user.lastName')
                            }
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Employee
                            <span aria-hidden="true">
                                    {getSortIcon(
                                        'user.lastName',
                                    )}
                                </span>
                        </button>
                    </th>

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
                                    {getSortIcon(
                                        'startDate',
                                    )}
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
                                    {getSortIcon(
                                        'endDate',
                                    )}
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
                        Reason
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
                        <td className="px-3 py-4 font-medium text-slate-900">
                            {request.userFullName}
                        </td>

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

                        <td className="max-w-64 px-3 py-4 text-slate-600">
                            {request.reason ?? '—'}
                        </td>

                        <td className="px-3 py-4">
                            {request.leaveStatusName ===
                            'PENDING' ? (
                                <div className="flex justify-end gap-2">
                                    <LeaveActionButton
                                        variant="approve"
                                        onClick={() =>
                                            onApprove(
                                                request.uuid,
                                            )
                                        }
                                        disabled={
                                            processingRequestUuid !==
                                            null
                                        }
                                        isLoading={
                                            processingRequestUuid ===
                                            request.uuid
                                        }
                                    >
                                        Approve
                                    </LeaveActionButton>

                                    <LeaveActionButton
                                        variant="reject"
                                        onClick={() =>
                                            onReject(
                                                request.uuid,
                                            )
                                        }
                                        disabled={
                                            processingRequestUuid !==
                                            null
                                        }
                                        isLoading={
                                            processingRequestUuid ===
                                            request.uuid
                                        }
                                    >
                                        Reject
                                    </LeaveActionButton>
                                </div>
                            ) : request.leaveStatusName ===
                            'APPROVED' &&
                            isFutureDate(
                                request.startDate,
                            ) ? (
                                <div className="flex justify-end">
                                    <LeaveActionButton
                                        variant="cancel"
                                        onClick={() =>
                                            onCancel(
                                                request.uuid,
                                            )
                                        }
                                        disabled={
                                            processingRequestUuid !==
                                            null
                                        }
                                        isLoading={
                                            processingRequestUuid ===
                                            request.uuid
                                        }
                                    >
                                        Cancel
                                    </LeaveActionButton>
                                </div>
                            ) : (
                                <p className="text-right text-slate-400">
                                    —
                                </p>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManageLeaveTable