import useManagedLeaveActions from './useManagedLeaveActions'
import useManagedLeaveList from './useManagedLeaveList'

function useManageLeaveRequests() {
    const leaveList = useManagedLeaveList()

    const leaveActions = useManagedLeaveActions(
        leaveList.reloadRequests,
    )

    return {
        ...leaveList,
        ...leaveActions,
    }
}

export default useManageLeaveRequests