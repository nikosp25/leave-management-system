import type { CurrentUser } from '../../../../types/User'
import type {
    EmployeeSortField,
    SortDirection,
} from '../../../../services/userApi'

type EmployeeSearchTableProps = {
    employees: CurrentUser[]
    sortField: EmployeeSortField
    sortDirection: SortDirection
    onSort: (field: EmployeeSortField) => void
}

function EmployeeSearchTable({
                                 employees,
                                 sortField,
                                 sortDirection,
                                 onSort,
                             }: EmployeeSearchTableProps) {
    function getSortIcon(field: EmployeeSortField) {
        if (sortField !== field) {
            return '↕'
        }

        return sortDirection === 'asc' ? '↑' : '↓'
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-900">
                <tr>
                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() => onSort('firstName')}
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            First name
                            <span aria-hidden="true">
                                    {getSortIcon('firstName')}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() => onSort('lastName')}
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Last name
                            <span aria-hidden="true">
                                    {getSortIcon('lastName')}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() => onSort('email')}
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Email
                            <span aria-hidden="true">
                                    {getSortIcon('email')}
                                </span>
                        </button>
                    </th>

                    <th className="px-3 py-3 font-semibold">
                        <button
                            type="button"
                            onClick={() =>
                                onSort('availableLeaveDays')
                            }
                            className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        >
                            Available days
                            <span aria-hidden="true">
                                    {getSortIcon(
                                        'availableLeaveDays',
                                    )}
                                </span>
                        </button>
                    </th>
                </tr>
                </thead>

                <tbody>
                {employees.length === 0 ? (
                    <tr>
                        <td
                            colSpan={4}
                            className="px-3 py-10 text-center text-slate-500"
                        >
                            No employees found.
                        </td>
                    </tr>
                ) : (
                    employees.map((employee) => (
                        <tr
                            key={employee.uuid}
                            className="border-b border-slate-100"
                        >
                            <td className="px-3 py-4 font-medium text-slate-900">
                                {employee.firstName}
                            </td>

                            <td className="px-3 py-4">
                                {employee.lastName}
                            </td>

                            <td className="px-3 py-4 text-slate-600">
                                {employee.email}
                            </td>

                            <td className="px-3 py-4">
                                {employee.availableLeaveDays}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    )
}

export default EmployeeSearchTable