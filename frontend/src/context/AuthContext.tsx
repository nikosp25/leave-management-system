import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { CurrentUser } from '../types/User'

type AuthContextValue = {
    currentUser: CurrentUser | null
    setCurrentUser: (user: CurrentUser | null) => void
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
)

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(
        null,
    )

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                setCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}