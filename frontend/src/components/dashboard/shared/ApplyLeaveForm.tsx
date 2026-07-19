import type { SubmitEvent } from 'react'
import { ChevronDown } from 'lucide-react'

function ApplyLeaveForm() {
    function handleSubmit(event: SubmitEvent) {
        event.preventDefault()

        const confirmed = window.confirm(
            'Are you sure you want to submit this leave request?',
        )

        if (!confirmed) {
            return
        }

        console.log('Leave request confirmed')
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                Apply for leave
            </h2>

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
                            className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-12 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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

                    <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-slate-700"
                    >
                        End date
                    </label>

                    <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
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
                        className="mt-1 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <button
                    type="submit"
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                >
                    Submit request
                </button>
            </form>
        </section>
    )
}

export default ApplyLeaveForm