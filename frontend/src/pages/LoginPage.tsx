import {useState} from 'react'
import type {SubmitEvent} from 'react'
import {Eye, EyeOff} from 'lucide-react'
import type {CurrentUser} from '../types/User'
import {useAuth} from '../hooks/useAuth'
import {Navigate, useNavigate} from 'react-router'

function LoginPage() {
    const {
        currentUser,
        setCurrentUser,
        isAuthLoading,
    } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    if (isAuthLoading) {
        return <p>Loading...</p>
    }

    if (currentUser) {
        return <Navigate to="/dashboard" replace/>
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        setError('')
        setIsLoading(true)

        try {
            const response = await fetch(
                'http://localhost:8080/api/v1/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',

                    signal: AbortSignal.timeout(7_000),

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                },
            )

            if (!response.ok) {
                const errorData = await response.json()

                throw new Error(
                    errorData.message ?? 'Invalid email or password',
                )
            }

            const userResponse = await fetch(
                'http://localhost:8080/api/v1/users/me',
                {
                    method: 'GET',
                    credentials: 'include',
                    signal: AbortSignal.timeout(7_000),
                },
            )

            if (!userResponse.ok) {
                throw new Error('Could not load the current user')
            }

            const user: CurrentUser = await userResponse.json()

            setCurrentUser(user)
            navigate('/dashboard')

        } catch (error) {
            if (
                error instanceof DOMException &&
                error.name === 'TimeoutError'
            ) {
                setError('The server took too long to respond. Please try again.')
            } else if (error instanceof TypeError) {
                setError('Could not connect to the server. Please try again.')
            } else if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
            <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in with your company account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            autoComplete="email"
                            placeholder="employee@company.com"
                            required
                            disabled={isLoading}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (currentValue) =>
                                            !currentValue,
                                    )
                                }
                                disabled={isLoading}
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed"
                            >
                                {showPassword ? (
                                    <EyeOff size={20}/>
                                ) : (
                                    <Eye size={20}/>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Contact your administrator if you cannot access
                    your account.
                </p>
            </section>
        </div>
    )
}

export default LoginPage