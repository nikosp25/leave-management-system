import {
    useEffect,
    useState,
} from 'react'
import {
    useNavigate,
    useParams,
} from 'react-router'
import type { CurrentUser } from '../types/User'
import {
    getUserForManagement,
} from '../services/userApi'
import useManagedUserActions from '../hooks/useManagedUserActions'
import UserForm, {
    type UserFormValues,
} from '../components/dashboard/admin/user-management/UserForm'

function UpdateUserPage() {
    const navigate = useNavigate()
    const { uuid } = useParams()

    const [user, setUser] =
        useState<CurrentUser | null>(null)

    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    const {
        isSubmitting,
        actionError,
        updateManagedUser,
    } = useManagedUserActions()

    useEffect(() => {
        if (!uuid) {
            setLoadError('User ID is missing.')
            setIsLoading(false)
            return
        }

        let ignore = false
        const controller = new AbortController()

        const timeoutId = window.setTimeout(
            () => controller.abort(),
            7_000,
        )

        async function loadUser() {
            setIsLoading(true)
            setLoadError('')

            try {
                const loadedUser =
                    await getUserForManagement(
                        uuid!,
                        controller.signal,
                    )

                if (!ignore) {
                    setUser(loadedUser)
                }
            } catch (error) {
                if (
                    !ignore &&
                    !(
                        error instanceof DOMException &&
                        error.name === 'AbortError'
                    )
                ) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred.',
                    )
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false)
                }
            }
        }

        void loadUser()

        return () => {
            ignore = true
            controller.abort()
            window.clearTimeout(timeoutId)
        }
    }, [uuid])

    async function handleSubmit(
        values: UserFormValues,
    ) {
        if (!uuid) {
            return
        }

        await updateManagedUser(uuid, {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            roleName: values.roleName,
        })

        navigate('/dashboard/manage-users')
    }

    if (isLoading) {
        return (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Loading user...
                </p>
            </section>
        )
    }

    if (loadError || !user) {
        return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm text-red-700">
                    {loadError || 'User could not be found.'}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate('/dashboard/manage-users')
                    }
                    className="mt-4 cursor-pointer rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                    Back to users
                </button>
            </section>
        )
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                Edit user
            </h2>

            <div className="mt-5">
                <UserForm
                    mode="edit"
                    initialValues={{
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        roleName: user.roleName as
                            | 'EMPLOYEE'
                            | 'MANAGER'
                            | 'ADMIN',
                    }}
                    isSubmitting={isSubmitting}
                    error={actionError}
                    onSubmit={handleSubmit}
                    onCancel={() =>
                        navigate('/dashboard/manage-users')
                    }
                />
            </div>
        </section>
    )
}

export default UpdateUserPage