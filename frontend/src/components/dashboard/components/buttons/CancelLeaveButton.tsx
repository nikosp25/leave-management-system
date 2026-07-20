type CancelLeaveButtonProps = {
    leaveRequestUuid: string
    onCancelled: () => void
    onError: (message: string) => void
}

type ApiErrorResponse = {
    message?: string
}

function CancelLeaveButton({
                               leaveRequestUuid,
                               onCancelled,
                               onError,
                           }: CancelLeaveButtonProps) {
    async function handleCancel() {
        const confirmed = window.confirm(
            'Are you sure you want to cancel this leave request?',
        )

        if (!confirmed) {
            return
        }

        onError('')

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/leave-requests/${leaveRequestUuid}/cancel`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    signal: AbortSignal.timeout(7_000),
                },
            )

            if (!response.ok) {
                let errorMessage =
                    'Could not cancel the leave request.'

                try {
                    const errorResponse: ApiErrorResponse =
                        await response.json()

                    if (errorResponse.message) {
                        errorMessage = errorResponse.message
                    }
                } catch {
                    // Keep the default error message.
                }

                throw new Error(errorMessage)
            }

            onCancelled()
        } catch (error) {
            onError(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.',
            )
        }
    }

    return (
        <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
        >
            Cancel
        </button>
    )
}

export default CancelLeaveButton