"use client"

import { ArrowRight, Merge } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TextureButton } from "@/components/ui/texture-button"
import { NeumorphButton } from "@/components/ui/neumorph-button"
import {
    TextureCardContent,
    TextureCardFooter,
    TextureCardHeader,
    TextureCardStyled,
    TextureCardTitle,
    TextureSeparator,
} from "@/components/ui/texture-card"

export default function SignIn() {
    return (
        <div className="flex items-center justify-center min-h-screen py-2">
            <div className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-center">
                    <div className="w-full">
                        <div>
                            <TextureCardStyled>
                                <TextureCardHeader className="flex flex-col gap-1 items-center justify-center p-3">
                                    <div className="p-2 bg-neutral-950 rounded-full mb-2">
                                        <Merge className="h-6 w-6 stroke-neutral-200" />
                                    </div>
                                    <TextureCardTitle>Create your account</TextureCardTitle>
                                    <p className="text-center text-sm">
                                        Welcome! Please fill in the details to get started.
                                    </p>
                                </TextureCardHeader>                <TextureSeparator />
                                <TextureCardContent className="px-4 py-3">
                                    <form className="flex flex-col gap-4">
                                        <div className="flex justify-between gap-2">
                                            <div>
                                                <Label htmlFor="first" className="text-sm">First name</Label>
                                                <Input
                                                    id="first"
                                                    type="first"
                                                    required
                                                    className="w-full px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="last" className="text-sm">Last Name</Label>
                                                <Input
                                                    id="last"
                                                    type="last"
                                                    required
                                                    className="w-full px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="id_number" className="text-sm">ID Number</Label>
                                            <Input
                                                id="id_number"
                                                type="number"
                                                required
                                                className="w-full px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-sm">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                className="w-full px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="password" className="text-sm">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                className="w-full px-3 py-1.5 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                                            />
                                        </div>
                                    </form>
                                </TextureCardContent>
                                <TextureSeparator />
                                <TextureCardFooter className="border-b rounded-b-sm p-3">
                                    <NeumorphButton fullWidth>
                                        <div className="flex gap-1 items-center justify-center">
                                            Continue
                                            <ArrowRight className="h-4 w-4 text-neutral-50 mt-[1px]" />
                                        </div>
                                    </NeumorphButton>
                                </TextureCardFooter>

                                <div className="dark:bg-neutral-800 bg-stone-100 pt-px rounded-b-[20px] overflow-hidden ">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="py-1.5 px-2">
                                            <div className="text-center text-sm">
                                                Already have an account?{" "}
                                                <span className="text-primary">Sign in</span>
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
