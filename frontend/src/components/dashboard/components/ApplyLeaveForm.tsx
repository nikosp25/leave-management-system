import { useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import {
    CalendarDays,
    ChevronDown,
} from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'

type ApiErrorResponse = {
    message?: string
}

function ApplyLeaveForm() {
    const { currentUser } = useAuth()

    const startDateRef = useRef<HTMLInputElement>(null)
    const endDateRef = useRef<HTMLInputElement>(null)

    const [leaveTypeName, setLeaveTypeName] =
        useState('PERSONAL_LEAVE')

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [reason, setReason] = useState('')

    const [isSubmitting, setIsSubmitting] =
        useState(false)

    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] =
        useState('')

    function isWeekend(date: string): boolean {
        const selectedDate = new Date(`${date}T00:00:00`)
        const dayOfWeek = selectedDate.getDay()

        return dayOfWeek === 0 || dayOfWeek === 6
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()

        if (!currentUser) {
            setError(
                'You must be logged in to submit a leave request.',
            )
            return
        }

        if (isWeekend(startDate) || isWeekend(endDate)) {
            setSuccessMessage('')
            setError(
                'A leave request cannot start or end on a weekend.',
            )
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to submit this leave request?',
        )

        if (!confirmed) {
            return
        }

        setIsSubmitting(true)
        setError('')
        setSuccessMessage('')

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/leave-requests/user/${currentUser.uuid}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        leaveTypeName,
                        startDate,
                        endDate,
                        reason: reason.trim(),
                    }),
                    signal: AbortSignal.timeout(7_000),
                },
            )

            if (!response.ok) {
                let errorMessage =
                    'Could not submit the leave request.'

                try {
                    const errorResponse: ApiErrorResponse =
                        await response.json()

                    if (errorResponse.message) {
                        errorMessage =
                            errorResponse.message
                    }
                } catch {
                    // Use the default error message.
                }

                throw new Error(errorMessage)
            }

            setSuccessMessage(
                'Your leave request was submitted successfully.',
            )

            setLeaveTypeName('PERSONAL_LEAVE')
            setStartDate('')
            setEndDate('')
            setReason('')
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    function openDatePicker(
        input: HTMLInputElement | null,
    ) {
        if (!input) {
            return
        }

        input.focus()
        input.showPicker?.()
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                Apply for leave
            </h2>

            {successMessage && (
                <p
                    role="status"
                    className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                    {successMessage}
                </p>
            )}

            {error && (
                <p
                    role="alert"
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-4"
            >
                <div>
                    <label
                        htmlFor="leaveType"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Leave type
                    </label>

                    <div className="group relative mt-1">
                        <select
                            id="leaveType"
                            name="leaveTypeName"
                            value={leaveTypeName}
                            onChange={(event) =>
                                setLeaveTypeName(
                                    event.target.value,
                                )
                            }
                            required
                            disabled={isSubmitting}
                            className="w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-12 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <option value="PERSONAL_LEAVE">
                                Personal Leave
                            </option>

                            <option value="SICK_LEAVE">
                                Sick Leave
                            </option>
                        </select>

                        <ChevronDown
                            aria-hidden="true"
                            strokeWidth={2.5}
                            className="pointer-events-none absolute right-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md bg-blue-50 p-1.5 text-blue-600 ring-1 ring-blue-100 transition-colors group-hover:bg-blue-100 group-hover:ring-blue-300 group-focus-within:bg-blue-100 group-focus-within:ring-blue-300"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Start date
                    </label>

                    <div className="relative mt-1">
                        <input
                            ref={startDateRef}
                            id="startDate"
                            name="startDate"
                            type="date"
                            value={startDate}
                            onChange={(event) =>
                                setStartDate(
                                    event.target.value,
                                )
                            }
                            onClick={() =>
                                openDatePicker(
                                    startDateRef.current,
                                )
                            }
                            required
                            disabled={isSubmitting}
                            className="w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />

                        <button
                            type="button"
                            aria-label="Open start date calendar"
                            disabled={isSubmitting}
                            onClick={() =>
                                openDatePicker(
                                    startDateRef.current,
                                )
                            }
                            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-colors hover:bg-blue-100 hover:ring-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <CalendarDays
                                size={17}
                                strokeWidth={2.2}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-slate-700"
                    >
                        End date
                    </label>

                    <div className="relative mt-1">
                        <input
                            ref={endDateRef}
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={endDate}
                            onChange={(event) =>
                                setEndDate(
                                    event.target.value,
                                )
                            }
                            onClick={() =>
                                openDatePicker(
                                    endDateRef.current,
                                )
                            }
                            required
                            disabled={isSubmitting}
                            className="w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />

                        <button
                            type="button"
                            aria-label="Open end date calendar"
                            disabled={isSubmitting}
                            onClick={() =>
                                openDatePicker(
                                    endDateRef.current,
                                )
                            }
                            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-colors hover:bg-blue-100 hover:ring-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <CalendarDays
                                size={17}
                                strokeWidth={2.2}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Reason
                    </label>

                    <textarea
                        id="reason"
                        name="reason"
                        rows={4}
                        maxLength={500}
                        value={reason}
                        onChange={(event) =>
                            setReason(event.target.value)
                        }
                        disabled={isSubmitting}
                        className="mt-1 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                    {isSubmitting
                        ? 'Submitting...'
                        : 'Submit request'}
                </button>
            </form>
        </section>
    )
}

export default ApplyLeaveForm