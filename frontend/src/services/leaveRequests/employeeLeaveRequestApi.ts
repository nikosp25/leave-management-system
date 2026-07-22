import type { LeaveRequest } from '../../types/LeaveRequest'
import type { PageResponse } from '../../types/PageResponse'
import type {
    ApiErrorResponse,
    CreateLeaveRequestBody,
    GetUserLeaveRequestsParameters,
} from './leaveRequestTypes'

const LEAVE_REQUESTS_URL =
    'http://localhost:8080/api/v1/leave-requests'

async function getApiErrorMessage(
    response: Response,
    defaultMessage: string,
): Promise<string> {
    try {
        const errorResponse: ApiErrorResponse =
            await response.json()

        return errorResponse.message ?? defaultMessage
    } catch {
        return defaultMessage
    }
}

export async function getApprovedLeavesForYear(
    userUuid: string,
    year: number,
    signal?: AbortSignal,
): Promise<LeaveRequest[]> {
    const response = await fetch(
        `${LEAVE_REQUESTS_URL}/user/${userUuid}/year/${year}`,
        {
            method: 'GET',
            credentials: 'include',
            signal,
        },
    )

    if (!response.ok) {
        throw new Error(
            'Could not load used leave days',
        )
    }

    return response.json()
}

export async function createLeaveRequest(
    userUuid: string,
    requestBody: CreateLeaveRequestBody,
    signal?: AbortSignal,
): Promise<LeaveRequest> {
    const response = await fetch(
        `${LEAVE_REQUESTS_URL}/user/${userUuid}`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal,
        },
    )

    if (!response.ok) {
        const errorMessage = await getApiErrorMessage(
            response,
            'Could not submit the leave request.',
        )

        throw new Error(errorMessage)
    }

    return response.json()
}

export async function getUserLeaveRequests({
                                               userUuid,
                                               pageNumber,
                                               pageSize,
                                               sortField,
                                               sortDirection,
                                               signal,
                                           }: GetUserLeaveRequestsParameters): Promise<
    PageResponse<LeaveRequest>
> {
    const parameters = new URLSearchParams({
        page: pageNumber.toString(),
        size: pageSize.toString(),
        sort: `${sortField},${sortDirection}`,
    })

    const response = await fetch(
        `${LEAVE_REQUESTS_URL}/user/${userUuid}?${parameters.toString()}`,
        {
            method: 'GET',
            credentials: 'include',
            signal,
        },
    )

    if (!response.ok) {
        throw new Error(
            'Could not load your leave requests',
        )
    }

    return response.json()
}

export async function cancelOwnLeaveRequest(
    leaveRequestUuid: string,
    signal?: AbortSignal,
): Promise<void> {
    const response = await fetch(
        `${LEAVE_REQUESTS_URL}/${leaveRequestUuid}/cancel`,
        {
            method: 'PATCH',
            credentials: 'include',
            signal,
        },
    )

    if (!response.ok) {
        const errorMessage = await getApiErrorMessage(
            response,
            'Could not cancel the leave request.',
        )

        throw new Error(errorMessage)
    }
}