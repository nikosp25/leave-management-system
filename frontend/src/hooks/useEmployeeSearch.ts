import { useEffect, useState } from 'react'
import type { CurrentUser } from '../types/User'
import {
    getEmployees,
} from '../services/userApi'
import type {
    EmployeeSortField,
    SortDirection,
} from '../services/userApi'
import { useAuth } from './useAuth'

const PAGE_SIZE = 5

function useEmployeeSearch() {
    const { currentUser } = useAuth()

    const [employees, setEmployees] =
        useState<CurrentUser[]>([])

    const [searchInput, setSearchInput] = useState('')
    const [appliedSearch, setAppliedSearch] = useState('')

    const [pageNumber, setPageNumber] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const [sortField, setSortField] =
        useState<EmployeeSortField>('lastName')

    const [sortDirection, setSortDirection] =
        useState<SortDirection>('asc')

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const canReadEmployees =
        currentUser?.capabilities.includes(
            'READ_EMPLOYEES',
        ) ?? false

    useEffect(() => {
        if (!currentUser || !canReadEmployees) {
            setIsLoading(false)
            return
        }

        let ignore = false
        const controller = new AbortController()

        const timeoutId = window.setTimeout(
            () => controller.abort(),
            7_000,
        )

        async function loadEmployees() {
            setIsLoading(true)
            setError('')

            try {
                const page = await getEmployees({
                    pageNumber,
                    pageSize: PAGE_SIZE,
                    sortField,
                    sortDirection,
                    search: appliedSearch,
                    signal: controller.signal,
                })

                if (!ignore) {
                    setEmployees(page.content)
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

        void loadEmployees()

        return () => {
            ignore = true
            controller.abort()
            window.clearTimeout(timeoutId)
        }
    }, [
        currentUser,
        canReadEmployees,
        appliedSearch,
        pageNumber,
        sortField,
        sortDirection,
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

    function handleSorting(
        field: EmployeeSortField,
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

    return {
        employees,

        searchInput,
        setSearchInput,
        appliedSearch,

        pageNumber,
        totalPages,

        sortField,
        sortDirection,

        isLoading,
        error,
        canReadEmployees,

        handleSearch,
        clearSearch,
        handleSorting,

        goToPreviousPage,
        goToNextPage,
    }
}

export default useEmployeeSearch