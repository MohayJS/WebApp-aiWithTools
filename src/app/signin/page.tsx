"use client"

import { useState } from "react"
import { ArrowRight, Merge, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

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
    email: string
    password: string
}

export default function SignIn() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
        // Clear error when user starts typing
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

            setSuccess('Sign in successful! Redirecting...')
            
            // Store token in localStorage (you might want to use a more secure method)
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            
            // Clear form
            setFormData({
                email: '',
                password: ''
            })
            
            // Redirect to main page or dashboard
            setTimeout(() => {
                router.push('/')
            }, 1000)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUpRedirect = () => {
        router.push('/signup')
    }

    return (
        <div className="flex items-center justify-center min-h-screen py-2 absolute inset-0 z-0"
            style={{
                backgroundImage: `
                radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
                radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
            }}
        >
            <div className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-center">
                    <div className="w-full">
                        <div>
                            <TextureCardStyled>
                                <TextureCardHeader className="flex flex-col gap-1 items-center justify-center p-3">
                                    <div className="p-2 bg-neutral-950 rounded-full mb-2">
                                        <Merge className="h-6 w-6 stroke-neutral-200" />
                                    </div>
                                    <TextureCardTitle>Welcome back</TextureCardTitle>
                                    <p className="text-center text-sm">
                                        Please sign in to your account to continue.
                                    </p>
                                </TextureCardHeader>
                                <TextureSeparator />
                                <TextureCardContent className="px-4 py-3">
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                        </div>
                                    )}
                                    {success && (
                                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md">
                                            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                                        </div>
                                    )}
                                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                        <div>
                                            <Label htmlFor="email" className="text-sm">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={isLoading}
                                                className="w-full px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                                                placeholder="Enter your email"
                                            />
                                        </div>                                        <div>
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
                                    </form>
                                </TextureCardContent>
                                <TextureSeparator />
                                <TextureCardFooter className="border-b rounded-b-sm p-3">
                                    <NeumorphButton fullWidth type="submit" disabled={isLoading} onClick={handleSubmit}>
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
                                </TextureCardFooter>

                                <div className="dark:bg-neutral-800 bg-stone-100 pt-px rounded-b-[20px] overflow-hidden ">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="py-1.5 px-2">
                                            <div className="text-center text-sm">
                                                Don't have an account?{" "}
                                                <span 
                                                    className="text-primary cursor-pointer hover:underline"
                                                    onClick={handleSignUpRedirect}
                                                >
                                                    Sign up
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <TextureSeparator />
                                    <div className="flex flex-col items-center justify-center ">
                                        <div className="py-1.5 px-2">
                                            <div className="text-center text-xs ">
                                                Secured by Supabase
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TextureCardStyled>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
