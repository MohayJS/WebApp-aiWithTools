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
    <div className="min-h-screen w-full bg-[#f8f9fc] relative overflow-hidden font-sans">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-pink-200/20 blur-[100px] animate-pulse delay-2000" />
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-20">
        <Sidebar className="h-full border-r border-white/40 bg-white/70 backdrop-blur-xl shadow-sm">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-sm tracking-wider">OE</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Enrollment</h2>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Student Portal</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-4 py-2">
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigateToPage(item.path)}
                    className={`
                      w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer border border-transparent
                      ${item.isActive 
                        ? 'bg-indigo-50 text-indigo-600 shadow-sm border-indigo-100' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-100'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg transition-colors duration-300
                      ${item.isActive ? 'bg-white shadow-sm' : 'bg-transparent group-hover:bg-white group-hover:shadow-sm'}
                    `}>
                      <Icon className={`h-5 w-5 transition-colors ${item.isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    </div>
                    <span className="text-sm font-bold tracking-wide">{item.label}</span>
                    {item.isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                    )}
                  </button>
                );
              })}
            </SidebarMenu>


            {/* User section at bottom */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-white/80 to-transparent">
              <div className="p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-white">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <NeumorphButton 
                  onClick={handleLogout} 
                  size="small"
                  className="w-full bg-white hover:bg-red-50 border-none shadow-sm hover:shadow text-gray-600 hover:text-red-600 transition-all"
                >
                  <div className="flex items-center gap-2 justify-center py-1">
                    <LogOut className="h-4 w-4" />
                    <span className="text-xs font-semibold">Sign Out</span>
                  </div>
                </NeumorphButton>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Main content */}
      <div className="ml-64 relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
