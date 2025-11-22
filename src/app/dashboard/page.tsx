"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { isAuthenticated, getUser, User } from '@/lib/auth';
import { BookOpen, GraduationCap, TrendingUp, Library, Users, Clock, MapPin } from 'lucide-react';

interface EnrolledCourse {
  code: string;
  title: string;
  units: number;
  section_code: string;
  schedule: string;
  room: string;
}

interface Section {
  id: number;
  section_code: string;
  schedule: string;
  room: string;
  capacity: number;
  enrolled_count: number;
  available_slots: number;
}

interface AvailableCourse {
  id: number;
  code: string;
  title: string;
  units: number;
  sections: Section[];
}

interface DashboardStats {
  enrolledCoursesCount: number;
  enrolledUnits: number;
  maxUnits: number;
  remainingUnits: number;
  enrolledCourses: EnrolledCourse[];
  availableCoursesCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/signin');
        return;
      }
      const userData = getUser();
      setUser(userData);
      
      // Only fetch stats if we have a user
      if (userData && userData.id) {
        fetchDashboardStats(userData.id);
        fetchAvailableCourses(userData.id);
      } else {
        setError('User data not available');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchDashboardStats = async (userId: string) => {
    try {
      const response = await fetch(`/api/dashboard/stats?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableCourses = async (userId: string) => {
    try {
      const response = await fetch(`/api/dashboard/available-courses?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableCourses(data.availableCourses || []);
      }
    } catch (err) {
      console.error('Error fetching available courses:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-indigo-600 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <DashboardLayout user={user}>
        <div className="p-6">
          <div className="p-6 rounded-2xl bg-red-50 border border-red-100 text-center">
            <p className="text-red-600 font-medium">{error || 'Failed to load dashboard'}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const dashboardCards = [
    {
      title: 'Enrolled Courses',
      value: stats.enrolledCoursesCount.toString(),
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-200'
    },
    {
      title: 'Enrolled Units',
      value: stats.enrolledUnits.toString(),
      icon: GraduationCap,
      gradient: 'from-violet-500 to-purple-500',
      shadow: 'shadow-violet-200'
    },
    {
      title: 'Remaining Units',
      value: stats.remainingUnits.toString(),
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-200'
    },
    {
      title: 'Available Courses',
      value: stats.availableCoursesCount.toString(),
      icon: Library,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-200'
    }
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight mb-2">
              {getTimeGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{user?.firstName}</span>
            </h1>
            <p className="text-gray-500 text-lg">Here's what's happening with your enrollment today.</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="group relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-4xl font-bold text-gray-800 mb-1 tracking-tight">{card.value}</p>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enrolled Courses List */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                My Enrolled Courses
              </h3>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6 min-h-[400px]">
              {stats.enrolledCourses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-10 w-10 text-indigo-300" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">No courses enrolled yet</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    You haven't enrolled in any courses for this semester. Check the available courses to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.enrolledCourses.map((course, index) => (
                    <div key={index} className="group p-5 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {course.code.substring(0, 2)}
                        </div>
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                          {course.units} units
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">{course.code}</h4>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-1">{course.title}</p>
                      
                      <div className="pt-4 border-t border-gray-50 space-y-2">
                        <div className="flex items-center text-xs font-medium text-gray-500">
                          <Users className="h-3.5 w-3.5 mr-2 text-gray-400" />
                          Section {course.section_code}
                        </div>
                        <div className="flex items-center text-xs font-medium text-gray-500">
                          <Clock className="h-3.5 w-3.5 mr-2 text-gray-400" />
                          {course.schedule}
                        </div>
                        {course.room && (
                          <div className="flex items-center text-xs font-medium text-gray-500">
                            <MapPin className="h-3.5 w-3.5 mr-2 text-gray-400" />
                            {course.room}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Courses & Sections */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Library className="h-5 w-5 text-indigo-600" />
                Available Courses
              </h3>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6 h-[600px] overflow-y-auto custom-scrollbar">
              {availableCourses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Library className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No eligible courses found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {availableCourses.map((course) => (
                    <div key={course.id} className="relative pl-4 border-l-2 border-indigo-100 hover:border-indigo-500 transition-colors duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">{course.code}</h4>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{course.title}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                          {course.units}u
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        {course.sections.map((section) => {
                          const isFull = section.available_slots <= 0;
                          return (
                            <div key={section.id} className={`
                              group flex items-center justify-between p-3 rounded-xl border transition-all duration-200
                              ${isFull 
                                ? 'bg-red-50/50 border-red-100 opacity-75' 
                                : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm cursor-default'
                              }
                            `}>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-gray-700">Sec {section.section_code}</span>
                                  {!isFull && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                                      {section.available_slots} left
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                  <span>{section.schedule}</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                                  <span>{section.room}</span>
                                </div>
                              </div>
                              
                              {isFull ? (
                                <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-md">FULL</span>
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                              )}
                            </div>
                          );
                        })}
                        {course.sections.length === 0 && (
                          <p className="text-xs text-gray-400 italic pl-1">No sections available</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

