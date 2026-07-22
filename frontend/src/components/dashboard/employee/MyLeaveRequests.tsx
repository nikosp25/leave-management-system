import useMyLeaveRequests from '../../../hooks/useMyLeaveRequests'
import MyLeaveRequestsTable from './MyLeaveRequestsTable'
import MyLeaveRequestsPagination from './MyLeaveRequestsPagination'

function MyLeaveRequests() {
    const {
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
    } = useMyLeaveRequests()

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
                        <MyLeaveRequestsTable
                            leaveRequests={leaveRequests}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            canCancelOwnLeave={
                                canCancelOwnLeave
                            }
                            onSort={handleSorting}
                            onCancelled={handleCancelled}
                            onError={setError}
                        />

                        <MyLeaveRequestsPagination
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
    )
}

export default MyLeaveRequests