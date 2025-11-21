"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, LogOut, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, isLoading, logout } = useAuth()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/signin")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        )
    }

    if (!user) {
        return null // Will redirect via useEffect
    }

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Accounts", href: "/admin/accounts", icon: Users },
        { name: "Courses", href: "/admin/courses", icon: BookOpen },
    ]

    return (
        <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Sidebar */}
            <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <div className="flex h-16 items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-lg font-bold tracking-tight">Admin Portal</span>
                </div>
                <div className="flex-1 flex flex-col gap-1 p-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:pl-64 flex-1 flex flex-col">
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
