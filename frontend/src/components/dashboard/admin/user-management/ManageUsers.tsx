import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { CurrentUser } from '../../../../types/User'
import { useAuth } from '../../../../hooks/useAuth'
import useManageUsers from '../../../../hooks/useManageUsers'
import useManagedUserActions from '../../../../hooks/useManagedUserActions'
import ManageUsersToolbar from './ManageUsersToolbar'
import ManageUsersTable from './ManageUsersTable'
import ManageUsersPagination from './ManageUsersPagination'
import DeleteUserDialog from './DeleteUserDialog'

function ManageUsers() {
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const [userToDelete, setUserToDelete] =
        useState<CurrentUser | null>(null)

    const {
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
    } = useManageUsers()

    const {
        processingUserUuid,
        actionError,
        deleteManagedUser,
        clearActionError,
    } = useManagedUserActions()

    function openDeleteDialog(user: CurrentUser) {
        clearActionError()
        setUserToDelete(user)
    }

    function closeDeleteDialog() {
        if (processingUserUuid !== null) {
            return
        }

        clearActionError()
        setUserToDelete(null)
    }

    async function confirmDelete() {
        if (!userToDelete) {
            return
        }

        try {
            await deleteManagedUser(userToDelete.uuid)
            setUserToDelete(null)

            if (users.length === 1 && pageNumber > 0) {
                goToPreviousPage()
            } else {
                refreshUsers()
            }
        } catch {
            // The action hook stores the error for the dialog.
        }
    }

    if (!currentUser) {
        return null
    }

    if (!canManageUsers) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-medium text-red-700">
                    You do not have permission to manage users.
                </p>
            </section>
        )
    }

    return (
        <>
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Manage users
                    </h2>

                    {!showDeleted && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    '/dashboard/manage-users/create',
                                )
                            }
                            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            Create user
                        </button>
                    )}
                </div>

                <ManageUsersToolbar
                    searchInput={searchInput}
                    appliedSearch={appliedSearch}
                    roleFilter={roleFilter}
                    showDeleted={showDeleted}
                    canReadDeletedUsers={canReadDeletedUsers}
                    onSearchInputChange={setSearchInput}
                    onSearch={handleSearch}
                    onClearSearch={clearSearch}
                    onRoleFilterChange={changeRoleFilter}
                    onToggleDeletedUsers={toggleDeletedUsers}
                />

                {isLoading && (
                    <p className="mt-5 text-sm text-slate-500">
                        Loading users...
                    </p>
                )}

                {error && (
                    <p
                        role="alert"
                        className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                {!isLoading &&
                    !error &&
                    users.length === 0 && (
                        <p className="mt-5 text-sm text-slate-500">
                            No matching users were found.
                        </p>
                    )}

                {!isLoading &&
                    !error &&
                    users.length > 0 && (
                        <div className="mt-5">
                            <ManageUsersTable
                                users={users}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                showDeleted={showDeleted}
                                currentUserUuid={currentUser.uuid}
                                processingUserUuid={
                                    processingUserUuid
                                }
                                onSort={handleSorting}
                                onEdit={(userUuid) =>
                                    navigate(
                                        `/dashboard/manage-users/${userUuid}/edit`,
                                    )
                                }
                                onDelete={openDeleteDialog}
                            />

                            <ManageUsersPagination
                                pageNumber={pageNumber}
                                totalPages={totalPages}
                                onPreviousPage={
                                    goToPreviousPage
                                }
                                onNextPage={goToNextPage}
                            />
                        </div>
                    )}
            </section>

            <DeleteUserDialog
                user={userToDelete}
                isDeleting={
                    processingUserUuid === userToDelete?.uuid
                }
                error={actionError}
                onCancel={closeDeleteDialog}
                onConfirm={() => void confirmDelete()}
            />
        </>
    )
}

export default ManageUsers