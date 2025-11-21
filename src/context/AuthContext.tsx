"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken, getUser, removeAuthToken, removeUser, setAuthToken, setUser as setLocalUser, User } from "@/lib/auth"

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const initAuth = () => {
            const token = getAuthToken()
            const savedUser = getUser()

            if (token && savedUser) {
                setUser(savedUser)
            }
            setIsLoading(false)
        }

        initAuth()
    }, [])

    const login = (token: string, userData: User) => {
        setAuthToken(token)
        setLocalUser(userData)
        setUser(userData)
        router.push("/dashboard")
    }

    const logout = () => {
        removeAuthToken()
        removeUser()
        setUser(null)
        router.push("/signin")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
