import useEmployeeSearch from '../../../../hooks/useEmployeeSearch'
import EmployeeSearchToolbar from './EmployeeSearchToolbar'
import EmployeeSearchTable from './EmployeeSearchTable'
import EmployeeSearchPagination from './EmployeeSearchPagination'

function EmployeeSearch() {
    const {
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
    } = useEmployeeSearch()

    if (!canReadEmployees) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-medium text-red-700">
                    You do not have permission to view employees.
                </p>
            </section>
        )
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Employees
                </h2>
            </div>


            <EmployeeSearchToolbar
                searchInput={searchInput}
                appliedSearch={appliedSearch}
                onSearchInputChange={setSearchInput}
                onSearch={handleSearch}
                onClearSearch={clearSearch}
            />

            {isLoading && (
                <p className="mt-5 text-sm text-slate-500">
                    Loading employees...
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
                employees.length === 0 && (
                    <p className="mt-5 text-sm text-slate-500">
                        No matching employees were found.
                    </p>
                )}

            {!isLoading &&
                !error &&
                employees.length > 0 && (
                    <div className="mt-5">
                        <EmployeeSearchTable
                            employees={employees}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSorting}
                        />

                        <EmployeeSearchPagination
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

export default EmployeeSearch