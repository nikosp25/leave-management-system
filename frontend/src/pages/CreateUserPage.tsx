import { useNavigate } from 'react-router'
import UserForm, {
    type UserFormValues,
} from '../components/dashboard/admin/user-management/UserForm'
import useManagedUserActions from '../hooks/useManagedUserActions'

function CreateUserPage() {
    const navigate = useNavigate()

    const {
        isSubmitting,
        actionError,
        createManagedUser,
    } = useManagedUserActions()

    async function handleSubmit(values: UserFormValues) {
        if (!values.password) {
            return
        }

        const confirmed = window.confirm(
            `Create ${values.firstName} ${values.lastName} as ${values.roleName}?\n\nEmail: ${values.email}`,
        )

        if (!confirmed) {
            return
        }

        await createManagedUser({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            roleName: values.roleName,
            password: values.password,
        })

        navigate('/dashboard/manage-users')
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                Create user
            </h2>

            <div className="mt-5">
                <UserForm
                    mode="create"
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

export default CreateUserPage