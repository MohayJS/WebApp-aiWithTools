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
            <div className="p-8 h-full flex flex-col">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">AI Enrollment Assistant</h1>
                    <p className="text-gray-600">Chat with the AI to manage your course enrollments.</p>
                </div>
                <div className="flex-1 min-h-0">
                    <ChatInterface user={user} />
                </div>
            </div>
        </DashboardLayout>
    );
}