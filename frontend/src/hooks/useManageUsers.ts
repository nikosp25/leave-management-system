import { useEffect, useState } from 'react'
import type { CurrentUser } from '../types/User'
import {
    getUsersForManagement,
    type ManagedUserSortField,
    type SortDirection,
    type UserRoleFilter,
} from '../services/userApi'
import { useAuth } from './useAuth'

const PAGE_SIZE = 5

function useManageUsers() {
    const { currentUser } = useAuth()

    const [users, setUsers] = useState<CurrentUser[]>([])

    const [searchInput, setSearchInput] = useState('')
    const [appliedSearch, setAppliedSearch] = useState('')

    const [roleFilter, setRoleFilter] =
        useState<UserRoleFilter>('')

    const [showDeleted, setShowDeleted] = useState(false)

    const [pageNumber, setPageNumber] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const [sortField, setSortField] =
        useState<ManagedUserSortField>('lastName')

    const [sortDirection, setSortDirection] =
        useState<SortDirection>('asc')

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const [refreshKey, setRefreshKey] = useState(0)

    const canManageUsers =
        currentUser?.capabilities.includes(
            'MANAGE_USERS',
        ) ?? false

    const canReadDeletedUsers =
        currentUser?.capabilities.includes(
            'READ_DELETED_USERS',
        ) ?? false

    useEffect(() => {
        if (
            !currentUser ||
            !canManageUsers ||
            (showDeleted && !canReadDeletedUsers)
        ) {
            setIsLoading(false)
            return
        }

        let ignore = false
        const controller = new AbortController()

        const timeoutId = window.setTimeout(
            () => controller.abort(),
            7_000,
        )

        async function loadUsers() {
            setIsLoading(true)
            setError('')

            try {
                const page = await getUsersForManagement({
                    deleted: showDeleted,
                    roleName: roleFilter,
                    search: appliedSearch,
                    pageNumber,
                    pageSize: PAGE_SIZE,
                    sortField,
                    sortDirection,
                    signal: controller.signal,
                })

                if (!ignore) {
                    setUsers(page.content)
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

        void loadUsers()

        return () => {
            ignore = true
            controller.abort()
            window.clearTimeout(timeoutId)
        }
    }, [
        currentUser,
        canManageUsers,
        canReadDeletedUsers,
        showDeleted,
        roleFilter,
        appliedSearch,
        pageNumber,
        sortField,
        sortDirection,
        refreshKey,
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

    function changeRoleFilter(roleName: UserRoleFilter) {
        setRoleFilter(roleName)
        setPageNumber(0)
    }

    function toggleDeletedUsers() {
        setShowDeleted((currentValue) => !currentValue)
        setPageNumber(0)
    }

    function handleSorting(field: ManagedUserSortField) {
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
        setPageNumber(
            (currentPage) => currentPage - 1,
        )
    }

    function goToNextPage() {
        setPageNumber(
            (currentPage) => currentPage + 1,
        )
    }

    function refreshUsers() {
        setRefreshKey(
            (currentKey) => currentKey + 1,
        )
    }

    return {
        users,

        searchInput,
        setSearchInput,
        appliedSearch,

        roleFilter,
        showDeleted,

        pageNumber,
        totalPages,

        sortField,
        sortDirection,

        isLoading,
        error,

        canManageUsers,
        canReadDeletedUsers,

        handleSearch,
        clearSearch,
        changeRoleFilter,
        toggleDeletedUsers,
        handleSorting,

        goToPreviousPage,
        goToNextPage,

        refreshUsers,
    }
}

export default useManageUsers