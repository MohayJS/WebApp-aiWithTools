"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NeumorphButton } from "@/components/ui/neumorph-button"
import {
    TextureCardContent,
    TextureCardHeader,
    TextureCardStyled,
    TextureCardTitle,
    TextureSeparator,
} from "@/components/ui/texture-card"
import { Label } from "@/components/ui/label"

interface User {
    id: string
    firstName: string
    middleName?: string
    lastName: string
    idNumber: string
    email: string
}

export default function AccountsPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        idNumber: "",
        email: "",
        password: "",
    })

    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users")
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const filteredUsers = users.filter((user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.idNumber.toString().includes(searchQuery)
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const url = "/api/admin/users"
            const method = editingUser ? "PUT" : "POST"
            const body = editingUser ? { ...formData, id: editingUser.id } : formData

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (response.ok) {
                const data = await response.json()
                setIsModalOpen(false)
                setEditingUser(null)
                setFormData({
                    firstName: "",
                    middleName: "",
                    lastName: "",
                    idNumber: "",
                    email: "",
                    password: "",
                })
                fetchUsers()

                if (data.password) {
                    setGeneratedPassword(data.password)
                }
            } else {
                console.error("Failed to save officer")
            }
        } catch (error) {
            console.error("Error saving officer", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this officer?")) return
        try {
            const response = await fetch(`/api/admin/users?id=${id}`, {
                method: "DELETE",
            })
            if (response.ok) {
                fetchUsers()
            }
        } catch (error) {
            console.error("Error deleting officer", error)
        }
    }

    const openModal = (user?: User) => {
        if (user) {
            setEditingUser(user)
            setFormData({
                firstName: user.firstName,
                middleName: user.middleName || "",
                lastName: user.lastName,
                idNumber: user.idNumber,
                email: user.email,
                password: "", // Don't populate password on edit
            })
        } else {
            setEditingUser(null)
            setFormData({
                firstName: "",
                middleName: "",
                lastName: "",
                idNumber: "",
                email: "",
                password: "",
            })
        }
        setIsModalOpen(true)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Manage enrollment officer accounts and permissions.
                    </p>
                </div>
                <NeumorphButton onClick={() => openModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Officer
                </NeumorphButton>
            </div>

            <TextureCardStyled>
                <TextureCardHeader className="p-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                        <Input
                            placeholder="Search officers..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </TextureCardHeader>
                <TextureSeparator />
                <TextureCardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-neutral-500 uppercase bg-neutral-50/50 dark:bg-neutral-900/50">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Employee ID</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-neutral-400" />
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                                            No officers found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                            <td className="px-6 py-4 font-medium">
                                                {user.firstName} {user.middleName} {user.lastName}
                                            </td>
                                            <td className="px-6 py-4">{user.idNumber}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openModal(user)}
                                                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-neutral-500 hover:text-red-600 dark:hover:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </TextureCardContent>
            </TextureCardStyled>

            {/* Officer Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg bg-white dark:bg-neutral-950 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {editingUser ? "Edit Officer" : "Add New Officer"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="middleName">Middle Name</Label>
                                        <Input
                                            id="middleName"
                                            value={formData.middleName}
                                            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="idNumber">Employee ID</Label>
                                    <Input
                                        id="idNumber"
                                        value={formData.idNumber}
                                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Institutional Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <NeumorphButton type="submit" disabled={isLoading}>
                                        {isLoading ? "Saving..." : "Save Officer"}
                                    </NeumorphButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Success/Password Modal */}
            {generatedPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white dark:bg-neutral-950 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">
                                Officer Created Successfully!
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Please copy the password below and share it with the officer. This is the only time it will be shown.
                            </p>

                            <div className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg mb-6 flex items-center justify-between border border-neutral-200 dark:border-neutral-800">
                                <code className="text-lg font-mono font-bold tracking-wider">
                                    {generatedPassword}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(generatedPassword)}
                                    className="text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    Copy
                                </button>
                            </div>

                            <div className="flex justify-end">
                                <NeumorphButton onClick={() => setGeneratedPassword(null)}>
                                    Done
                                </NeumorphButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
