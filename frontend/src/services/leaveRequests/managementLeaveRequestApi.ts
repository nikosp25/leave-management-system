import type { LeaveRequest } from '../../types/LeaveRequest'
import type { PageResponse } from '../../types/PageResponse'
import type {
    GetManagedLeaveRequestsParameters,
} from './leaveRequestTypes'

const LEAVE_REQUESTS_URL =
    'http://localhost:8080/api/v1/leave-requests'

export async function getManagedLeaveRequests({
                                                  pageNumber,
                                                  pageSize,
                                                  sortField,
                                                  sortDirection,
                                                  search,
                                                  statusFilter,
                                                  signal,
                                              }: GetManagedLeaveRequestsParameters): Promise<
    PageResponse<LeaveRequest>
> {
    const parameters = new URLSearchParams({
        page: pageNumber.toString(),
        size: pageSize.toString(),
        sort: `${sortField},${sortDirection}`,
    })

    if (search && statusFilter === 'ALL') {
        parameters.set('search', search)
    }

    const endpoint =
        statusFilter === 'ALL'
            ? LEAVE_REQUESTS_URL
            : `${LEAVE_REQUESTS_URL}/status/${statusFilter}`

    const response = await fetch(
        `${endpoint}?${parameters.toString()}`,
        {
            method: 'GET',
            credentials: 'include',
            signal,
        },
    )

    if (!response.ok) {
        throw new Error(
            'Could not load employee leave requests.',
        )
    }

    return response.json()
}

export async function updateManagedLeaveStatus(
    requestUuid: string,
    newStatus: 'APPROVED' | 'REJECTED',
    comment: string | null,
): Promise<LeaveRequest> {
    const response = await fetch(
        `${LEAVE_REQUESTS_URL}/${requestUuid}/status`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                leaveStatusName: newStatus,
                comment,
            }),
        },
    )

    if (!response.ok) {
        throw new Error(
            `Could not ${newStatus.toLowerCase()} the leave request.`,
        )
    }

    return response.json()
}

export async function cancelManagedLeave(
    requestUuid: string,
): Promise<LeaveRequest> {
    const response = await fetch(
        `${LEAVE_REQUESTS_URL}/${requestUuid}/management-cancel`,
        {
            method: 'PATCH',
            credentials: 'include',
        },
    )

    if (!response.ok) {
        throw new Error(
            'Could not cancel the approved leave request.',
        )
    }

    return response.json()
}