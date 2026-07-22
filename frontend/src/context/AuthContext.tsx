import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { CurrentUser } from '../types/User'

type AuthContextValue = {
    currentUser: CurrentUser | null
    setCurrentUser: (user: CurrentUser | null) => void
    refreshCurrentUser: () => Promise<void>
    isAuthLoading: boolean
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<
    AuthContextValue | undefined
>(undefined)

export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    const [currentUser, setCurrentUser] =
        useState<CurrentUser | null>(null)

    const [isAuthLoading, setIsAuthLoading] =
        useState(true)

    async function refreshCurrentUser() {
        const response = await fetch(
            'http://localhost:8080/api/v1/users/me',
            {
                method: 'GET',
                credentials: 'include',
                signal: AbortSignal.timeout(7_000),
            },
        )

        if (!response.ok) {
            throw new Error(
                'Could not refresh the current user.',
            )
        }

        const user: CurrentUser =
            await response.json()

        setCurrentUser(user)
    }

    useEffect(() => {
        let ignore = false

        async function restoreCurrentUser() {
            try {
                const response = await fetch(
                    'http://localhost:8080/api/v1/users/me',
                    {
                        method: 'GET',
                        credentials: 'include',
                        signal: AbortSignal.timeout(7_000),
                    },
                )

                if (!response.ok) {
                    if (!ignore) {
                        setCurrentUser(null)
                    }

                    return
                }

                const user: CurrentUser =
                    await response.json()

                if (!ignore) {
                    setCurrentUser(user)
                }
            } catch {
                if (!ignore) {
                    setCurrentUser(null)
                }
            } finally {
                if (!ignore) {
                    setIsAuthLoading(false)
                }
            }
        }

        void restoreCurrentUser()

        return () => {
            ignore = true
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                refreshCurrentUser,
                isAuthLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}