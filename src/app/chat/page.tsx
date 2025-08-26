"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ChatInterface from "@/components/ChatInterface";
import { isAuthenticated, getUser, User } from '@/lib/auth';

export default function ChatPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            if (!isAuthenticated()) {
                router.push('/signin');
                return;
            }
            const userData = getUser();
            setUser(userData);
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-[#fefcff] relative flex items-center justify-center">
                <div className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
                        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
                        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
                    }}
                >
                </div>
                <div className="z-10">Loading...</div>
            </div>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="h-full flex flex-col">
                <div className="text-center p-6 border-b border-gray-200/20">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Gemini 2.5 Flash Chat
                    </h1>
                    <p className="text-gray-600">
                        Powered by Google's latest AI technology
                    </p>
                </div>
                <div className="flex-1">
                    <ChatInterface />
                </div>
            </div>
        </DashboardLayout>
    );
}