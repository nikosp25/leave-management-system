import type { CurrentUser } from '../../types/User'
import type { PageResponse } from '../../types/PageResponse'
import { apiFetch } from '../apiFetch'

const USERS_URL =
    'http://localhost:8080/api/v1/users'

export type EmployeeSortField =
    | 'lastName'
    | 'firstName'
    | 'email'
    | 'availableLeaveDays'

export type SortDirection = 'asc' | 'desc'

type GetEmployeesParameters = {
    pageNumber: number
    pageSize: number
    sortField: EmployeeSortField
    sortDirection: SortDirection
    search: string
    signal?: AbortSignal
}

export async function getEmployees({
                                       pageNumber,
                                       pageSize,
                                       sortField,
                                       sortDirection,
                                       search,
                                       signal,
                                   }: GetEmployeesParameters): Promise<
    PageResponse<CurrentUser>
> {
    const parameters = new URLSearchParams({
        page: pageNumber.toString(),
        size: pageSize.toString(),
        sort: `${sortField},${sortDirection}`,
    })

    if (search) {
        parameters.set('search', search)
    }

    const response = await apiFetch(
        `${USERS_URL}/role/EMPLOYEE?${parameters.toString()}`,
        {
            method: 'GET',
            signal,
        },
    )

    if (!response.ok) {
        throw new Error(
            'Could not load employees.',
        )
    }

    return response.json()
}