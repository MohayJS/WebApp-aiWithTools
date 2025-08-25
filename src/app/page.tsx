"use client"

import { useRouter } from 'next/navigation';
import { NeumorphButton } from '@/components/ui/neumorph-button';
import { TextureCard } from '@/components/ui/texture-card';
import { 
  GraduationCap, 
  Bot, 
  Zap, 
  Shield, 
  Clock, 
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Building2
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-[#fefcff] relative overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
          radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
          radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%),
          radial-gradient(circle at 80% 80%, rgba(144, 238, 144, 0.3), transparent 60%)`,
        }}
      >
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">MSU Enrollment AI</h1>
              <p className="text-sm text-gray-600">Mindanao State University</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NeumorphButton 
              onClick={() => router.push('/signin')} 
              intent="secondary"
              size="medium"
            >
              Sign In
            </NeumorphButton>
            <NeumorphButton 
              onClick={() => router.push('/signup')} 
              size="medium"
            >
              Get Started
            </NeumorphButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-6">
              <Star className="h-4 w-4" />
              Revolutionary AI-Powered Enrollment
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Enroll with Just Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Student ID</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Experience the future of university enrollment at Mindanao State University. 
              Our AI agent handles everything - from course selection to schedule optimization - 
              all you need is your student ID number.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <NeumorphButton 
              onClick={() => router.push('/signup')} 
              size="large"
              className="group"
            >
              <div className="flex items-center gap-3">
                Start Enrollment
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </NeumorphButton>
            <NeumorphButton 
              onClick={() => router.push('/signin')} 
              intent="secondary"
              size="large"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                Existing Student
              </div>
            </NeumorphButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">30 sec</div>
              <div className="text-gray-700">Average enrollment time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-700">Accuracy rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-700">Available anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Three simple steps to complete your enrollment with AI assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TextureCard className="p-8 text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Enter Student ID</h3>
              <p className="text-gray-700">
                Simply provide your MSU student ID number - that's all we need to get started
              </p>
            </TextureCard>

            <TextureCard className="p-8 text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. AI Does the Work</h3>
              <p className="text-gray-700">
                Our intelligent agent analyzes your academic record and suggests optimal course combinations
              </p>
            </TextureCard>

            <TextureCard className="p-8 text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Instant Enrollment</h3>
              <p className="text-gray-700">
                Review and confirm your schedule - enrollment complete in under a minute
              </p>
            </TextureCard>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose MSU AI Enrollment?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Revolutionary technology meets traditional academic excellence at Mindanao State University
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                    <p className="text-gray-700">Complete your enrollment in seconds, not hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                    <p className="text-gray-700">Bank-level security protecting your academic data</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Availability</h3>
                    <p className="text-gray-700">Enroll anytime, anywhere - no more waiting in lines</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <TextureCard className="p-8">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-2xl text-white text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Mindanao State University</h3>
                  <p className="text-blue-100 mb-4">Main Campus</p>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">15,000+</div>
                    <div className="text-sm text-blue-100">Students Enrolled</div>
                  </div>
                </div>
              </TextureCard>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join thousands of MSU students who have already simplified their enrollment process
          </p>
          <NeumorphButton 
            onClick={() => router.push('/signup')} 
            size="large"
            className="group"
          >
            <div className="flex items-center gap-3">
              Get Started Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </NeumorphButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-semibold">MSU Enrollment AI</span>
          </div>
          <p className="text-gray-400 mb-4">
            Mindanao State University - Main Campus
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 MSU Enrollment AI. Powered by artificial intelligence.
          </p>
        </div>
      </footer>
    </main>
  );
}