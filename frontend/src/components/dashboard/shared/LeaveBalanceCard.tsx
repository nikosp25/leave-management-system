type LeaveBalanceCardProps = {
    availableLeaveDays: number
    usedLeaveDays: number | null
}

function LeaveBalanceCard({
                              availableLeaveDays,
                              usedLeaveDays,
                          }: LeaveBalanceCardProps) {
    return (
        <article className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
                Available leave days
            </p>

            <div className="mt-3 flex items-end justify-between gap-6">
                <div>
                    <p className="text-3xl font-bold text-blue-700">
                        {availableLeaveDays}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                        remaining
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                        {usedLeaveDays ?? '—'}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                        used this year
                    </p>
                </div>
            </div>
        </article>
    )
}

export default LeaveBalanceCard