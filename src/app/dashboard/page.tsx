"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { isAuthenticated, getUser, logout, User } from '@/lib/auth';
import { NeumorphButton } from '@/components/ui/neumorph-button';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Dashboard() {
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

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-[#fefcff] relative flex items-center justify-center">
        <div className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
            radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
            }}
          >
        </div>
        <div className="z-10">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#fefcff] relative">
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
          radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
          radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
          }}
        >
      </div>
      
      {/* Header with user info and logout */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <UserIcon className="h-5 w-5" />
            <span className="text-sm">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
          </div>
          <NeumorphButton onClick={handleLogout} size="small">
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </div>
          </NeumorphButton>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="relative z-10">
        <ChatInterface />
      </div>
    </main>
  );
}
