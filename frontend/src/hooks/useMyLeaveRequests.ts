import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import type { LeaveRequest } from '../types/LeaveRequest'
import {
    getUserLeaveRequests,
} from '../services/leaveRequestApi'
import type {
    SortDirection,
    UserLeaveSortField,
} from '../services/leaveRequestApi'

function useMyLeaveRequests() {
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
        useState<UserLeaveSortField>('startDate')

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
                const page = await getUserLeaveRequests({
                    userUuid,
                    pageNumber,
                    pageSize: 5,
                    sortField,
                    sortDirection,
                    signal: AbortSignal.timeout(7_000),
                })

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

    function handleSorting(
        field: UserLeaveSortField,
    ) {
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

    function goToPreviousPage() {
        setSuccessMessage('')

        setPageNumber((currentPage) =>
            currentPage - 1,
        )
    }

    function goToNextPage() {
        setSuccessMessage('')

        setPageNumber((currentPage) =>
            currentPage + 1,
        )
    }

    return {
        leaveRequests,

        isLoading,
        error,
        setError,
        successMessage,

        pageNumber,
        totalPages,

        sortField,
        sortDirection,

        canCancelOwnLeave,

        handleCancelled,
        handleSorting,

        goToPreviousPage,
        goToNextPage,
    }
}

export default useMyLeaveRequests