import type { CurrentUser } from '../../../../types/User'

type DeleteUserDialogProps = {
    user: CurrentUser | null
    isDeleting: boolean
    error: string
    onCancel: () => void
    onConfirm: () => void
}

function DeleteUserDialog({
                              user,
                              isDeleting,
                              error,
                              onCancel,
                              onConfirm,
                          }: DeleteUserDialogProps) {
    if (!user) {
        return null
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        >
            <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
                <h2
                    id="delete-user-title"
                    className="text-lg font-semibold text-slate-900"
                >
                    Delete user?
                </h2>

                <p className="mt-3 text-sm text-slate-600">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                    </span>
                    ?
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    {user.email} will lose access, but their
                    account and leave history will be preserved.
                </p>

                {error && (
                    <p
                        role="alert"
                        className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting
                            ? 'Deleting...'
                            : 'Delete user'}
                    </button>
                </div>
            </section>
        </div>
    )
}

export default DeleteUserDialog