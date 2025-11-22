"use client"

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChatInterface from '@/components/ChatInterface';
import { useAuth } from '@/lib/auth';

export default function ChatPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return null; // Middleware handles redirect
    }

    return (
        <DashboardLayout user={user}>
            <div className="h-screen flex flex-col">
                <ChatInterface user={user} />
            </div>
        </DashboardLayout>
    );
}