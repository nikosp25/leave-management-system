type ManageLeavePaginationProps = {
    pageNumber: number
    totalPages: number
    onPreviousPage: () => void
    onNextPage: () => void
}

function ManageLeavePagination({
                                   pageNumber,
                                   totalPages,
                                   onPreviousPage,
                                   onNextPage,
                               }: ManageLeavePaginationProps) {
    if (totalPages <= 1) {
        return null
    }

    return (
        <div className="mt-4 flex items-center justify-between">
            <button
                type="button"
                disabled={pageNumber === 0}
                onClick={onPreviousPage}
                className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                ← Previous
            </button>

            <p className="text-sm text-slate-600">
                Page {pageNumber + 1} of {totalPages}
            </p>

            <button
                type="button"
                disabled={pageNumber + 1 >= totalPages}
                onClick={onNextPage}
                className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Next →
            </button>
        </div>
    )
}

export default ManageLeavePagination