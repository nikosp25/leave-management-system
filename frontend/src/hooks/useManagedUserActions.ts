import { useState } from 'react'
import {
    createUser,
    deleteUser,
    updateUser,
    type CreateUserRequest,
    type UpdateUserRequest,
} from '../services/userApi'

function useManagedUserActions() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [processingUserUuid, setProcessingUserUuid] =
        useState<string | null>(null)

    const [actionError, setActionError] = useState('')

    async function createManagedUser(
        user: CreateUserRequest,
    ) {
        setIsSubmitting(true)
        setActionError('')

        try {
            return await createUser(user)
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.'

            setActionError(message)
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    async function updateManagedUser(
        userUuid: string,
        user: UpdateUserRequest,
    ) {
        setIsSubmitting(true)
        setProcessingUserUuid(userUuid)
        setActionError('')

        try {
            return await updateUser(userUuid, user)
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.'

            setActionError(message)
            throw error
        } finally {
            setIsSubmitting(false)
            setProcessingUserUuid(null)
        }
    }

    async function deleteManagedUser(userUuid: string) {
        setProcessingUserUuid(userUuid)
        setActionError('')

        try {
            await deleteUser(userUuid)
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.'

            setActionError(message)
            throw error
        } finally {
            setProcessingUserUuid(null)
        }
    }

    function clearActionError() {
        setActionError('')
    }

    return {
        isSubmitting,
        processingUserUuid,
        actionError,

        createManagedUser,
        updateManagedUser,
        deleteManagedUser,
        clearActionError,
    }
}

export default useManagedUserActions