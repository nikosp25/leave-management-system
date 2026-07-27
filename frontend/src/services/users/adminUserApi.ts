import type { CurrentUser } from '../../types/User'
import type { PageResponse } from '../../types/PageResponse'
import type { SortDirection } from './employeeUserApi'

const USERS_URL =
    'http://localhost:8080/api/v1/users'

export type UserRoleFilter =
    | ''
    | 'EMPLOYEE'
    | 'MANAGER'
    | 'ADMIN'

export type UserRoleName = Exclude<UserRoleFilter, ''>

export type ManagedUserSortField =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'availableLeaveDays'

export type CreateUserRequest = {
    firstName: string
    lastName: string
    email: string
    roleName: UserRoleName
    password: string
}

export type UpdateUserRequest = {
    firstName: string
    lastName: string
    email: string
    roleName: UserRoleName
}

type GetManagedUsersParameters = {
    deleted: boolean
    roleName: UserRoleFilter
    search: string
    pageNumber: number
    pageSize: number
    sortField: ManagedUserSortField
    sortDirection: SortDirection
    signal?: AbortSignal
}

export async function getUsersForManagement({
                                                deleted,
                                                roleName,
                                                search,
                                                pageNumber,
                                                pageSize,
                                                sortField,
                                                sortDirection,
                                                signal,
                                            }: GetManagedUsersParameters): Promise<
    PageResponse<CurrentUser>
> {
    const parameters = new URLSearchParams({
        page: pageNumber.toString(),
        size: pageSize.toString(),
        sort: `${sortField},${sortDirection}`,
    })

    if (roleName) {
        parameters.set('roleName', roleName)
    }

    if (search) {
        parameters.set('search', search)
    }

    const endpoint = deleted
        ? `${USERS_URL}/deleted`
        : USERS_URL

    const response = await fetch(
        `${endpoint}?${parameters.toString()}`,
        {
            method: 'GET',
            credentials: 'include',
            signal,
        },
    )

    if (!response.ok) {
        throw new Error('Could not load users.')
    }

    return response.json()
}

export async function getUserForManagement(
    userUuid: string,
    signal?: AbortSignal,
): Promise<CurrentUser> {
    const response = await fetch(
        `${USERS_URL}/${userUuid}`,
        {
            method: 'GET',
            credentials: 'include',
            signal,
        },
    )

    if (!response.ok) {
        throw new Error('Could not load user.')
    }

    return response.json()
}

export async function createUser(
    user: CreateUserRequest,
): Promise<CurrentUser> {
    const response = await fetch(USERS_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })

    if (!response.ok) {
        throw new Error('Could not create user.')
    }

    return response.json()
}

export async function updateUser(
    userUuid: string,
    user: UpdateUserRequest,
): Promise<CurrentUser> {
    const response = await fetch(
        `${USERS_URL}/${userUuid}`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        },
    )

    if (!response.ok) {
        throw new Error('Could not update user.')
    }

    return response.json()
}

export async function deleteUser(
    userUuid: string,
): Promise<void> {
    const response = await fetch(
        `${USERS_URL}/${userUuid}`,
        {
            method: 'DELETE',
            credentials: 'include',
        },
    )

    if (!response.ok) {
        throw new Error('Could not delete user.')
    }
}