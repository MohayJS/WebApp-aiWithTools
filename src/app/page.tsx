"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NeuralBackground } from '@/components/ui/neural-background';
import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Calendar,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleAuthNavigation = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <main className="min-h-screen w-full relative overflow-x-hidden text-white font-sans selection:bg-blue-500/30">
      <NeuralBackground />
      
      {/* Overlay Gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 p-6 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Enrollment AI
              </h1>
            </div>
          </div>
          <button
            onClick={handleAuthNavigation}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all duration-300 font-medium text-sm flex items-center gap-2 group"
          >
            {user ? 'Dashboard' : 'Sign In'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <motion.div
          className="max-w-7xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>The Future of Academic Enrollment</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
            Enrollment, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
              Reimagined with AI
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Forget long lines and confusing forms. Chat with your personal AI assistant to handle your schedule, check prerequisites, and enroll in seconds.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleAuthNavigation}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Chatting Now
            </button>
            <button className="px-8 py-4 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-white/10 backdrop-blur-md text-white font-medium text-lg transition-all duration-300">
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-6 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-blue-400" />}
              title="Natural Language"
              description="Just ask 'What courses can I take?' or 'Enroll me in Math 101'. No complex codes needed."
              delay={0.2}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-purple-400" />}
              title="Instant Processing"
              description="Our AI checks prerequisites, conflicts, and slot availability in milliseconds."
              delay={0.4}
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
              title="Smart Validation"
              description="Never worry about invalid schedules. The AI ensures you meet all requirements before enrolling."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-slate-400 text-lg">Three simple steps to your perfect schedule</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0" />

            <StepCard
              number="01"
              icon={<GraduationCap className="w-6 h-6" />}
              title="Connect"
              description="Sign in with your student ID. The AI instantly loads your academic history."
            />
            <StepCard
              number="02"
              icon={<BookOpen className="w-6 h-6" />}
              title="Consult"
              description="Chat with the AI to find courses, check sections, and plan your semester."
            />
            <StepCard
              number="03"
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Confirm"
              description="Review your generated schedule and confirm enrollment with one click."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value="24/7" label="Availability" />
            <StatItem value="< 1min" label="Avg. Enrollment Time" />
            <StatItem value="100%" label="Accuracy" />
            <StatItem value="Zero" label="Waiting in Line" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Bot className="w-5 h-5" />
            <span className="font-medium">Enrollment AI</span>
          </div>
          {/* <p className="text-slate-600 text-sm">
            © 2025 Mindanao State University. All rights reserved.
          </p> */}
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/50 w-fit group-hover:scale-110 transition-transform duration-300 border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div className="w-24 h-24 rounded-full bg-slate-900 border border-blue-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:border-blue-500 transition-colors duration-300 shadow-lg shadow-blue-900/20">
        <div className="text-blue-500 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 max-w-xs mx-auto">{description}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2">
        {value}
      </div>
      <div className="text-blue-400 font-medium text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}