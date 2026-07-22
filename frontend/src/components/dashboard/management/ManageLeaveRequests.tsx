import useManageLeaveRequests from '../../../hooks/useManageLeaveRequests'
import ManageLeavePagination from './ManageLeavePagination'
import ManageLeaveTable from './ManageLeaveTable'
import ManageLeaveToolbar from './ManageLeaveToolbar'

function ManageLeaveRequests() {
    const {
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
        actionError,
        processingRequestUuid,

        canReadAllLeave,

        handleSearch,
        clearSearch,
        togglePendingOnly,
        toggleApprovedOnly,
        handleSorting,

        approveLeaveRequest,
        rejectLeaveRequest,
        cancelApprovedLeave,

        goToPreviousPage,
        goToNextPage,
    } = useManageLeaveRequests()

    if (!canReadAllLeave) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-medium text-red-700">
                    You do not have permission to view all leave
                    requests.
                </p>
            </section>
        )
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Employee leave requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Search for employees and review their leave
                    requests.
                </p>
            </div>

            <ManageLeaveToolbar
                searchInput={searchInput}
                appliedSearch={appliedSearch}
                showPendingOnly={showPendingOnly}
                showApprovedOnly={showApprovedOnly}
                onSearchInputChange={setSearchInput}
                onSearch={handleSearch}
                onClearSearch={clearSearch}
                onTogglePendingOnly={togglePendingOnly}
                onToggleApprovedOnly={toggleApprovedOnly}
            />

            {isLoading && (
                <p className="mt-5 text-sm text-slate-500">
                    Loading leave requests...
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

            {actionError && (
                <p
                    role="alert"
                    className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {actionError}
                </p>
            )}

            {!isLoading &&
                !error &&
                leaveRequests.length === 0 && (
                    <p className="mt-5 text-sm text-slate-500">
                        No matching leave requests were found.
                    </p>
                )}

            {!isLoading &&
                !error &&
                leaveRequests.length > 0 && (
                    <div className="mt-5">
                        <ManageLeaveTable
                            leaveRequests={leaveRequests}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            processingRequestUuid={
                                processingRequestUuid
                            }
                            onSort={handleSorting}
                            onApprove={(requestUuid) =>
                                void approveLeaveRequest(
                                    requestUuid,
                                )
                            }
                            onReject={(requestUuid) =>
                                void rejectLeaveRequest(
                                    requestUuid,
                                )
                            }
                            onCancel={(requestUuid) =>
                                void cancelApprovedLeave(
                                    requestUuid,
                                )
                            }
                        />

                        <ManageLeavePagination
                            pageNumber={pageNumber}
                            totalPages={totalPages}
                            onPreviousPage={goToPreviousPage}
                            onNextPage={goToNextPage}
                        />
                    </div>
                )}
        </section>
    )
}

export default ManageLeaveRequests