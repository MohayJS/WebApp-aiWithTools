"use client"

import { useState } from "react"
import { ArrowRight, Merge, Loader2, Lock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NeumorphButton } from "@/components/ui/neumorph-button"
import {
    TextureCardContent,
    TextureCardFooter,
    TextureCardHeader,
    TextureCardStyled,
    TextureCardTitle,
    TextureSeparator,
} from "@/components/ui/texture-card"

interface FormData {
    identifier: string
    password: string
}

export default function SignIn() {
    const router = useRouter()
    const { login } = useAuth()
    const [formData, setFormData] = useState<FormData>({
        identifier: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Password Change State
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [tempToken, setTempToken] = useState<string | null>(null)
    const [tempUser, setTempUser] = useState<any | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong')
            }

            if (data.user.mustChangePassword) {
                setTempToken(data.token)
                setTempUser(data.user)
                setShowChangePassword(true)
                setIsLoading(false)
                return
            }

            setSuccess('Sign in successful! Redirecting...')
            login(data.token, data.user)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setIsLoading(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        // Client-side validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{7,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError("Password must be at least 7 characters, contain 1 uppercase letter, 1 number, and no symbols.")
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tempToken}`
                },
                body: JSON.stringify({ newPassword })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update password')
            }

            setSuccess('Password updated! Signing you in...')

            // Update user object to reflect password change
            const updatedUser = { ...tempUser, mustChangePassword: false }
            login(tempToken!, updatedUser)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update password')
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen py-2 absolute inset-0 z-0"
            style={{
                backgroundImage: `
                radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
                radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
            }}
        >
            <div className="w-full max-w-md mx-auto px-4">
                <div className="flex items-center justify-center">
                    <div className="w-full">
                        <TextureCardStyled>
                            <TextureCardHeader className="flex flex-col gap-1 items-center justify-center p-3">
                                <div className="p-2 bg-neutral-950 rounded-full mb-2">
                                    {showChangePassword ? (
                                        <Lock className="h-6 w-6 stroke-neutral-200" />
                                    ) : (
                                        <Merge className="h-6 w-6 stroke-neutral-200" />
                                    )}
                                </div>
                                <TextureCardTitle>
                                    {showChangePassword ? "Change Password" : "Welcome back"}
                                </TextureCardTitle>
                                <p className="text-center text-sm px-4">
                                    {showChangePassword
                                        ? "For security, please update your password to continue."
                                        : "Please sign in to your account to continue."}
                                </p>
                            </TextureCardHeader>
                            <TextureSeparator />
                            <TextureCardContent className="px-4 py-3">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md">
                                        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                                    </div>
                                )}

                                {showChangePassword ? (
                                    <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
                                        <div className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 p-3 rounded mb-2">
                                            <p className="font-semibold mb-1">Password Requirements:</p>
                                            <ul className="list-disc pl-4 space-y-0.5">
                                                <li>Minimum 7 characters</li>
                                                <li>At least one uppercase letter</li>
                                                <li>At least one number</li>
                                                <li>No symbols allowed (alphanumeric only)</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                disabled={isLoading}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={isLoading}
                                                className="w-full"
                                            />
                                        </div>
                                        <NeumorphButton fullWidth type="submit" disabled={isLoading}>
                                            {isLoading ? "Updating..." : "Update Password & Sign In"}
                                        </NeumorphButton>
                                    </form>
                                ) : (
                                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                        <div>
                                            <Label htmlFor="identifier" className="text-sm">Email or ID Number</Label>
                                            <Input
                                                id="identifier"
                                                type="text"
                                                required
                                                value={formData.identifier}
                                                onChange={handleInputChange}
                                                disabled={isLoading}
                                                className="w-full px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                                                placeholder="Enter your email or ID number"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="password" className="text-sm">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                disabled={isLoading}
                                                className="w-full px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-neutral-500 hover:text-primary cursor-pointer">
                                                Forgot password?
                                            </span>
                                        </div>
                                        <TextureSeparator className="my-2" />
                                        <NeumorphButton fullWidth type="submit" disabled={isLoading}>
                                            <div className="flex gap-1 items-center justify-center">
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Signing in...
                                                    </>
                                                ) : (
                                                    <>
                                                        Sign In
                                                        <ArrowRight className="h-4 w-4 text-neutral-50 mt-[1px]" />
                                                    </>
                                                )}
                                            </div>
                                        </NeumorphButton>
                                    </form>
                                )}
                            </TextureCardContent>
                        </TextureCardStyled>
                    </div>
                </div>
            </div>
        </div>
    )
}
