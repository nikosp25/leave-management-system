export type LeaveStatusFilter =
    | 'ALL'
    | 'PENDING'
    | 'APPROVED'

export type ManageLeaveSortField =
    | 'user.lastName'
    | 'leaveType.name'
    | 'startDate'
    | 'endDate'
    | 'leaveStatus.name'

export type UserLeaveSortField =
    | 'leaveType.name'
    | 'startDate'
    | 'endDate'
    | 'leaveStatus.name'

export type SortDirection = 'asc' | 'desc'

export type CreateLeaveRequestBody = {
    leaveTypeName: string
    startDate: string
    endDate: string
    reason: string
}

export type ApiErrorResponse = {
    message?: string
}

export type GetManagedLeaveRequestsParameters = {
    pageNumber: number
    pageSize: number
    sortField: ManageLeaveSortField
    sortDirection: SortDirection
    search: string
    statusFilter: LeaveStatusFilter
    signal?: AbortSignal
}

export type GetUserLeaveRequestsParameters = {
    userUuid: string
    pageNumber: number
    pageSize: number
    sortField: UserLeaveSortField
    sortDirection: SortDirection
    signal?: AbortSignal
}