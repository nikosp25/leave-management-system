export type LeaveRequest = {
    uuid: string
    userFullName: string
    leaveTypeName: string
    leaveStatusName: string
    startDate: string
    endDate: string
    reason: string | null
    managerComment: string | null
}