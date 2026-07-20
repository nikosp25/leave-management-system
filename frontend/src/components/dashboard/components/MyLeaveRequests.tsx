import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import type { LeaveRequest } from '../../../types/LeaveRequest'
import type { PageResponse } from '../../../types/PageResponse'
import CancelLeaveButton from './buttons/CancelLeaveButton'

type SortField =
    | 'leaveType.name'
    | 'startDate'
    | 'endDate'
    | 'leaveStatus.name'

type SortDirection = 'asc' | 'desc'

function MyLeaveRequests() {
    const { currentUser } = useAuth()

    const [leaveRequests, setLeaveRequests] =
        useState<LeaveRequest[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] =
        useState('')

    const [pageNumber, setPageNumber] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const [sortField, setSortField] =
        useState<SortField>('startDate')

    const [sortDirection, setSortDirection] =
        useState<SortDirection>('desc')

    const [refreshKey, setRefreshKey] = useState(0)

    const canCancelOwnLeave =
        currentUser?.capabilities.includes(
            'CANCEL_OWN_LEAVE',
        ) ?? false

    useEffect(() => {
        if (!currentUser) {
            setIsLoading(false)
            return
        }

        const userUuid = currentUser.uuid

        setIsLoading(true)
        setError('')

        let ignore = false

        async function loadLeaveRequests() {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/leave-requests/user/${userUuid}?page=${pageNumber}&size=5&sort=${sortField},${sortDirection}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        signal: AbortSignal.timeout(7_000),
                    },
                )

                if (!response.ok) {
                    throw new Error(
                        'Could not load your leave requests',
                    )
                }

                const page: PageResponse<LeaveRequest> =
                    await response.json()

                if (!ignore) {
                    setLeaveRequests(page.content)
                    setTotalPages(page.totalPages)
                }
            } catch (error) {
                if (!ignore) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred',
                    )
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false)
                }
            }
        }

        void loadLeaveRequests()

        return () => {
            ignore = true
        }
    }, [
        currentUser,
        pageNumber,
        sortField,
        sortDirection,
        refreshKey,
    ])

    function handleCancelled() {
        setSuccessMessage(
            'Your leave request was cancelled successfully.',
        )

        setRefreshKey((currentKey) => currentKey + 1)
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

    function handleSorting(field: SortField) {
        setPageNumber(0)
        setSuccessMessage('')

        if (sortField === field) {
            setSortDirection((currentDirection) =>
                currentDirection === 'asc'
                    ? 'desc'
                    : 'asc',
            )
            return
        }

        setSortField(field)
        setSortDirection('asc')
    }

    function getSortIcon(field: SortField) {
        if (sortField !== field) {
            return '↕'
        }

        return sortDirection === 'asc' ? '↑' : '↓'
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                My leave requests
            </h2>

            {successMessage && (
                <p
                    role="status"
                    className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                    {successMessage}
                </p>
            )}

            {isLoading && (
                <p className="mt-3 text-sm text-slate-500">
                    Loading leave requests...
                </p>
            )}

            {error && (
                <p
                    role="alert"
                    className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </p>
            )}

            {!isLoading &&
                !error &&
                leaveRequests.length === 0 && (
                    <p className="mt-3 text-sm text-slate-500">
                        You have no leave requests yet.
                    </p>
                )}

            {!isLoading &&
                !error &&
                leaveRequests.length > 0 && (
                    <div className="mt-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50 text-slate-900">
                                <tr>
                                    <th className="px-3 py-3 font-semibold">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSorting(
                                                    'leaveType.name',
                                                )
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
                                                handleSorting(
                                                    'startDate',
                                                )
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
                                                handleSorting(
                                                    'endDate',
                                                )
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
                                                handleSorting(
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
                                {leaveRequests.map(
                                    (request) => (
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
                                                {
                                                    request.startDate
                                                }
                                            </td>

                                            <td className="px-3 py-4">
                                                {
                                                    request.endDate
                                                }
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
                                                            handleCancelled
                                                        }
                                                        onError={
                                                            setError
                                                        }
                                                    />
                                                ) : (
                                                    <span className="text-slate-400">
                                                            —
                                                        </span>
                                                )}
                                            </td>
                                        </tr>
                                    ),
                                )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <button
                                    type="button"
                                    disabled={pageNumber === 0}
                                    onClick={() => {
                                        setSuccessMessage('')
                                        setPageNumber(
                                            (currentPage) =>
                                                currentPage - 1,
                                        )
                                    }}
                                    className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ← Previous
                                </button>

                                <p className="text-sm text-slate-600">
                                    Page {pageNumber + 1} of{' '}
                                    {totalPages}
                                </p>

                                <button
                                    type="button"
                                    disabled={
                                        pageNumber + 1 >=
                                        totalPages
                                    }
                                    onClick={() => {
                                        setSuccessMessage('')
                                        setPageNumber(
                                            (currentPage) =>
                                                currentPage + 1,
                                        )
                                    }}
                                    className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                )}
        </section>
    )
}

export default MyLeaveRequests