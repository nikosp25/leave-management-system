import { useState } from 'react'
import {
    cancelManagedLeave,
    updateManagedLeaveStatus,
} from '../services/leaveRequestApi'
import { useAuth } from './useAuth'

function useManagedLeaveActions(
    onActionComplete: () => void,
) {
    const { refreshCurrentUser } = useAuth()

    const [actionError, setActionError] = useState('')

    const [
        processingRequestUuid,
        setProcessingRequestUuid,
    ] = useState<string | null>(null)

    async function updateLeaveStatus(
        requestUuid: string,
        newStatus: 'APPROVED' | 'REJECTED',
    ) {
        let comment: string | null = null

        if (newStatus === 'REJECTED') {
            comment = window.prompt(
                'Enter the reason for rejecting this request:',
            )

            if (comment === null) {
                return
            }

            if (!comment.trim()) {
                setActionError(
                    'A rejection reason must be provided.',
                )
                return
            }

            comment = comment.trim()
        }

        const confirmed = window.confirm(
            `Are you sure you want to ${newStatus.toLowerCase()} this leave request?`,
        )

        if (!confirmed) {
            return
        }

        setProcessingRequestUuid(requestUuid)
        setActionError('')

        try {
            await updateManagedLeaveStatus(
                requestUuid,
                newStatus,
                comment,
            )

            await refreshCurrentUser()
            onActionComplete()
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.',
            )
        } finally {
            setProcessingRequestUuid(null)
        }
    }

    async function approveLeaveRequest(
        requestUuid: string,
    ) {
        await updateLeaveStatus(
            requestUuid,
            'APPROVED',
        )
    }

    async function rejectLeaveRequest(
        requestUuid: string,
    ) {
        await updateLeaveStatus(
            requestUuid,
            'REJECTED',
        )
    }

    async function cancelApprovedLeave(
        requestUuid: string,
    ) {
        const confirmed = window.confirm(
            'Are you sure you want to cancel this approved leave request?',
        )

        if (!confirmed) {
            return
        }

        setProcessingRequestUuid(requestUuid)
        setActionError('')

        try {
            await cancelManagedLeave(requestUuid)

            await refreshCurrentUser()
            onActionComplete()
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.',
            )
        } finally {
            setProcessingRequestUuid(null)
        }
    }

    return {
        actionError,
        processingRequestUuid,

        approveLeaveRequest,
        rejectLeaveRequest,
        cancelApprovedLeave,
    }
}

export default useManagedLeaveActions