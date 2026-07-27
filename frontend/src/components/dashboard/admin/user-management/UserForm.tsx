import {
    useEffect,
    useState,
    type SubmitEvent,
} from 'react'
import {
    ChevronDown,
    Eye,
    EyeOff,
} from 'lucide-react'
import type {
    UserRoleFilter,
    UserRoleName,
} from '../../../../services/userApi'

export type UserFormValues = {
    firstName: string
    lastName: string
    email: string
    roleName: UserRoleName
    password?: string
}

type UserFormInitialValues = {
    firstName: string
    lastName: string
    email: string
    roleName: UserRoleName
}

type UserFormProps = {
    mode: 'create' | 'edit'
    initialValues?: UserFormInitialValues
    isSubmitting: boolean
    error: string
    onSubmit: (
        values: UserFormValues,
    ) => Promise<void> | void
    onCancel: () => void
}

function UserForm({
                      mode,
                      initialValues,
                      isSubmitting,
                      error,
                      onSubmit,
                      onCancel,
                  }: UserFormProps) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')

    const [roleName, setRoleName] =
        useState<UserRoleFilter>('')

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] =
        useState(false)

    useEffect(() => {
        if (!initialValues) {
            return
        }

        setFirstName(initialValues.firstName)
        setLastName(initialValues.lastName)
        setEmail(initialValues.email)
        setRoleName(initialValues.roleName)
    }, [initialValues])

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        if (!roleName) {
            return
        }

        const values: UserFormValues = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            roleName,
        }

        if (mode === 'create') {
            values.password = password
        }

        await onSubmit(values)
    }

    const inputClasses =
        'mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                    First name

                    <input
                        type="text"
                        value={firstName}
                        onChange={(event) =>
                            setFirstName(event.target.value)
                        }
                        required
                        minLength={2}
                        maxLength={50}
                        autoComplete="given-name"
                        className={inputClasses}
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Last name

                    <input
                        type="text"
                        value={lastName}
                        onChange={(event) =>
                            setLastName(event.target.value)
                        }
                        required
                        minLength={2}
                        maxLength={50}
                        autoComplete="family-name"
                        className={inputClasses}
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Email

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                        autoComplete="email"
                        className={inputClasses}
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Role

                    <div className="relative mt-2">
                        <select
                            value={roleName}
                            onChange={(event) =>
                                setRoleName(
                                    event.target
                                        .value as UserRoleFilter,
                                )
                            }
                            required
                            className="w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="" disabled>
                                Select a role
                            </option>

                            <option value="EMPLOYEE">
                                Employee
                            </option>

                            <option value="MANAGER">
                                Manager
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>
                        </select>

                        <ChevronDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                    </div>
                </label>

                {mode === 'create' && (
                    <div className="md:col-span-2">
                        <label
                            htmlFor="user-password"
                            className="text-sm font-medium text-slate-700"
                        >
                            Password
                        </label>

                        <div className="relative mt-2">
                            <input
                                id="user-password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value,
                                    )
                                }
                                required
                                minLength={8}
                                pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,}"
                                title="Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long."
                                autoComplete="new-password"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-11 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (currentValue) =>
                                            !currentValue,
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                                aria-pressed={showPassword}
                                title={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-700"
                            >
                                {showPassword ? (
                                    <EyeOff
                                        size={18}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <Eye
                                        size={18}
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                            At least 8 characters with uppercase,
                            lowercase, number, and special character.
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <p
                    role="alert"
                    className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? 'Saving...'
                        : mode === 'create'
                            ? 'Create user'
                            : 'Save changes'}
                </button>
            </div>
        </form>
    )
}

export default UserForm