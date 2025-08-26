"use client"

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { NeumorphButton } from '@/components/ui/neumorph-button';
import { logout, User } from '@/lib/auth';
import { LayoutDashboard, MessageCircle, LogOut, User as UserIcon } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const navigateToPage = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      isActive: pathname === '/dashboard'
    },
    {
      label: 'Chat',
      icon: MessageCircle,
      path: '/chat',
      isActive: pathname === '/chat'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative flex">
      {/* Background */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
          radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
          radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />

      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">W</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">WebApp</h2>
                <p className="text-xs text-gray-600">LLM Tools</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem
                    key={item.path}
                    isActive={item.isActive}
                    onClick={() => navigateToPage(item.path)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            {/* User section at bottom */}
            <div className="mt-auto pt-8 space-y-4">
              <div className="p-3 rounded-lg bg-white/20 border border-gray-200/30">
                <div className="flex items-center gap-3 mb-3">
                  <UserIcon className="h-4 w-4 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <NeumorphButton 
                  onClick={handleLogout} 
                  size="small"
                  className="w-full"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <LogOut className="h-3 w-3" />
                    <span className="text-xs">Logout</span>
                  </div>
                </NeumorphButton>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-10">
        {children}
      </div>
    </div>
  );
}
