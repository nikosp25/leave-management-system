import { cancelOwnLeaveRequest } from '../../../services/leaveRequestApi'

type CancelLeaveButtonProps = {
    leaveRequestUuid: string
    onCancelled: () => void
    onError: (message: string) => void
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
            await cancelOwnLeaveRequest(
                leaveRequestUuid,
                AbortSignal.timeout(7_000),
            )

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