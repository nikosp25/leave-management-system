import type { UserRoleFilter } from '../../../../services/userApi'

export type UserFormErrors = {
    firstName?: string
    lastName?: string
    email?: string
    roleName?: string
    password?: string
}

type ValidateUserFormParameters = {
    mode: 'create' | 'edit'
    firstName: string
    lastName: string
    email: string
    roleName: UserRoleFilter
    password: string
}

const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PASSWORD_PATTERN =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,}$/

export function validateUserForm({
                                     mode,
                                     firstName,
                                     lastName,
                                     email,
                                     roleName,
                                     password,
                                 }: ValidateUserFormParameters): UserFormErrors {
    const errors: UserFormErrors = {}

    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedFirstName) {
        errors.firstName = 'First name is required.'
    } else if (trimmedFirstName.length < 2) {
        errors.firstName =
            'First name must contain at least 2 characters.'
    } else if (trimmedFirstName.length > 50) {
        errors.firstName =
            'First name cannot exceed 50 characters.'
    }

    if (!trimmedLastName) {
        errors.lastName = 'Last name is required.'
    } else if (trimmedLastName.length < 2) {
        errors.lastName =
            'Last name must contain at least 2 characters.'
    } else if (trimmedLastName.length > 50) {
        errors.lastName =
            'Last name cannot exceed 50 characters.'
    }

    if (!trimmedEmail) {
        errors.email = 'Email is required.'
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
        errors.email =
            'Please enter a valid email address.'
    }

    if (!roleName) {
        errors.roleName = 'Please select a role.'
    }

    if (mode === 'create') {
        if (!password) {
            errors.password = 'Password is required.'
        } else if (!PASSWORD_PATTERN.test(password)) {
            errors.password =
                'Password must have at least 8 characters, including uppercase, lowercase, number, and special character.'
        }
    }

    return errors
}