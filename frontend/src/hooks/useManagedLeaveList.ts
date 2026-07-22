import { useEffect, useState } from 'react'
import type { LeaveRequest } from '../types/LeaveRequest'
import {
    getManagedLeaveRequests,
} from '../services/leaveRequestApi'
import type {
    LeaveStatusFilter,
    ManageLeaveSortField,
    SortDirection,
} from '../services/leaveRequestApi'
import { useAuth } from './useAuth'

const PAGE_SIZE = 5

function useManagedLeaveList() {
    const { currentUser } = useAuth()

    const [leaveRequests, setLeaveRequests] =
        useState<LeaveRequest[]>([])

    const [searchInput, setSearchInput] = useState('')
    const [appliedSearch, setAppliedSearch] = useState('')

    const [statusFilter, setStatusFilter] =
        useState<LeaveStatusFilter>('ALL')

    const [pageNumber, setPageNumber] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const [sortField, setSortField] =
        useState<ManageLeaveSortField>('startDate')

    const [sortDirection, setSortDirection] =
        useState<SortDirection>('desc')

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    const canReadAllLeave =
        currentUser?.capabilities.includes(
            'READ_ALL_LEAVE',
        ) ?? false

    const showPendingOnly =
        statusFilter === 'PENDING'

    const showApprovedOnly =
        statusFilter === 'APPROVED'

    useEffect(() => {
        if (!currentUser || !canReadAllLeave) {
            setIsLoading(false)
            return
        }

        let ignore = false
        const controller = new AbortController()

        const timeoutId = window.setTimeout(
            () => controller.abort(),
            7_000,
        )

        async function loadLeaveRequests() {
            setIsLoading(true)
            setError('')

            try {
                const page =
                    await getManagedLeaveRequests({
                        pageNumber,
                        pageSize: PAGE_SIZE,
                        sortField,
                        sortDirection,
                        search: appliedSearch,
                        statusFilter,
                        signal: controller.signal,
                    })

                if (!ignore) {
                    setLeaveRequests(page.content)
                    setTotalPages(page.totalPages)
                }
            } catch (error) {
                if (
                    !ignore &&
                    !(
                        error instanceof DOMException &&
                        error.name === 'AbortError'
                    )
                ) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred.',
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
            controller.abort()
            window.clearTimeout(timeoutId)
        }
    }, [
        currentUser,
        canReadAllLeave,
        appliedSearch,
        statusFilter,
        pageNumber,
        sortField,
        sortDirection,
        reloadKey,
    ])

    function handleSearch() {
        setPageNumber(0)
        setAppliedSearch(searchInput.trim())
    }

    function clearSearch() {
        setSearchInput('')
        setAppliedSearch('')
        setPageNumber(0)
    }

    function togglePendingOnly() {
        setStatusFilter((currentFilter) =>
            currentFilter === 'PENDING'
                ? 'ALL'
                : 'PENDING',
        )

        setPageNumber(0)
    }

    function toggleApprovedOnly() {
        setStatusFilter((currentFilter) =>
            currentFilter === 'APPROVED'
                ? 'ALL'
                : 'APPROVED',
        )

        setPageNumber(0)
    }

    function handleSorting(
        field: ManageLeaveSortField,
    ) {
        setPageNumber(0)

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
        setPageNumber((currentPage) =>
            currentPage - 1,
        )
    }

    function goToNextPage() {
        setPageNumber((currentPage) =>
            currentPage + 1,
        )
    }

    function reloadRequests() {
        setReloadKey((currentKey) => currentKey + 1)
    }

    return {
        leaveRequests,

        searchInput,
        setSearchInput,
        appliedSearch,

        showPendingOnly,
        showApprovedOnly,

        pageNumber,
        totalPages,

        sortField,
        sortDirection,

        isLoading,
        error,
        canReadAllLeave,

        handleSearch,
        clearSearch,
        togglePendingOnly,
        toggleApprovedOnly,
        handleSorting,

        goToPreviousPage,
        goToNextPage,
        reloadRequests,
    }
}

export default useManagedLeaveList