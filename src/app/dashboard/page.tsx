"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { isAuthenticated, getUser, User } from '@/lib/auth';
import { NeumorphButton } from '@/components/ui/neumorph-button';
import { BarChart3, Users, Activity, TrendingUp } from 'lucide-react';

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

  const dashboardStats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: Users,
      change: '+12%',
      positive: true
    },
    {
      title: 'Active Sessions',
      value: '89',
      icon: Activity,
      change: '+5%',
      positive: true
    },
    {
      title: 'Monthly Growth',
      value: '23%',
      icon: TrendingUp,
      change: '+2%',
      positive: true
    },
    {
      title: 'Analytics',
      value: '456',
      icon: BarChart3,
      change: '-1%',
      positive: false
    }
  ];

  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}! Here's what's happening with your application.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <NeumorphButton 
                className="w-full justify-start"
                onClick={() => router.push('/chat')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Start New Chat Session</span>
                </div>
              </NeumorphButton>
              <NeumorphButton className="w-full justify-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>View User Analytics</span>
                </div>
              </NeumorphButton>
              <NeumorphButton className="w-full justify-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Check System Status</span>
                </div>
              </NeumorphButton>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                { action: 'Chat session completed', time: '5 minutes ago', type: 'chat' },
                { action: 'System update deployed', time: '1 hour ago', type: 'system' },
                { action: 'Database backup completed', time: '2 hours ago', type: 'system' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-100' :
                    activity.type === 'chat' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'chat' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
