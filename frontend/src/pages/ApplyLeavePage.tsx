import ApplyLeaveForm from '../components/dashboard/employee/ApplyLeaveForm'

function ApplyLeavePage() {
    return (
        <section>
            <h1 className="text-2xl font-bold text-slate-900">
                Apply for leave
            </h1>

            <div className="mt-6 max-w-2xl">
                <ApplyLeaveForm />
            </div>
        </section>
    )
}

export default ApplyLeavePage