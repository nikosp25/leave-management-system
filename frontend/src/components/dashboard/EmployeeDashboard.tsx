import {useEffect, useState} from 'react'
import {useAuth} from '../../hooks/useAuth'
import LeaveBalanceCard from './components/LeaveBalanceCard'
import MyLeaveRequests from './components/MyLeaveRequests'
import type {LeaveRequest} from '../../types/LeaveRequest'

function parseLocalDate(date: string) {
    const [year, month, day] = date
        .split('-')
        .map(Number)

    return new Date(year, month - 1, day)
}

function calculateWorkingDays(
    startDate: string,
    endDate: string,
) {
    const start = parseLocalDate(startDate)
    const end = parseLocalDate(endDate)

    let workingDays = 0
    const currentDate = new Date(start)

    while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay()

        const isWeekend =
            dayOfWeek === 0 || dayOfWeek === 6

        if (!isWeekend) {
            workingDays++
        }

        currentDate.setDate(currentDate.getDate() + 1)
    }

    return workingDays
}

function EmployeeDashboard() {
    const {currentUser} = useAuth()

    const [usedLeaveDays, setUsedLeaveDays] =
        useState<number | null>(null)

    useEffect(() => {
        if (!currentUser) {
            return
        }

        const userUuid = currentUser.uuid
        const currentYear = new Date().getFullYear()

        let ignore = false

        async function loadUsedLeaveDays() {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/leave-requests/user/${userUuid}/year/${currentYear}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        signal: AbortSignal.timeout(7_000),
                    },
                )

                if (!response.ok) {
                    throw new Error(
                        'Could not load used leave days',
                    )
                }

                const approvedRequests: LeaveRequest[] =
                    await response.json()

                const totalUsedDays =
                    approvedRequests.reduce(
                        (total, request) =>
                            total +
                            calculateWorkingDays(
                                request.startDate,
                                request.endDate,
                            ),
                        0,
                    )

                if (!ignore) {
                    setUsedLeaveDays(totalUsedDays)
                }
            } catch (error) {
                if (!ignore) {
                    setUsedLeaveDays(null)
                }

                console.error(error)
            }
        }

        void loadUsedLeaveDays()

        return () => {
            ignore = true
        }
    }, [currentUser])

    if (!currentUser) {
        return null
    }

    return (
        <section>
            <div className="max-w-sm">
                <LeaveBalanceCard
                    availableLeaveDays={
                        currentUser.availableLeaveDays
                    }
                    usedLeaveDays={usedLeaveDays}
                />
            </div>

            <div className="mt-6">
                <MyLeaveRequests/>
            </div>
        </section>
    )
}

export default EmployeeDashboard



