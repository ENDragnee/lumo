"use client"

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap, ChevronRight, Menu, X, Bot, WifiOff, BarChart, BookOpen, Target,
  PenSquare, Mail, Phone, Users, CheckCircle2, AlertTriangle, Sparkles, BrainCircuit, Layers,
  CloudOff, DollarSign, MessageSquare, Award, Book, Search, Settings,
  Lightbulb, TrendingUp, Coffee, Zap, CheckCircle, Loader2, Palette, UploadCloud, BarChart3
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle"; // Assuming path is correct
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Import Tabs components

// --- Animation Variants ---
const fadeIn = (direction = 'up', delay = 0, duration = 0.8, yStart = 40) => ({
  hidden: { opacity: 0, y: yStart },
  show: { opacity: 1, y: 0, transition: { type: 'spring', duration, delay, ease: 'easeOut', bounce: 0.25 } }
});
const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } }
});
// --- (End Animation Variants) ---

export default function LandingPageV2() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };
  
  const navigateAndCloseMenu = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  // --- NEW PALETTE STYLES ---
  const primaryButtonStyle = "bg-gradient-to-r from-[#FF79C6] to-[#BD93F9] hover:opacity-90 text-white font-semibold py-3 px-7 rounded-xl inline-flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-[#BD93F9]/30";
  const secondaryButtonStyle = "bg-white/10 dark:bg-[#44475A]/70 border border-slate-300 dark:border-[#6272A4]/50 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-[#44475A] text-slate-800 dark:text-[#F8F8F2] font-semibold py-3 px-7 rounded-xl inline-flex items-center gap-2 transition-all duration-300 ease-in-out";

  return (
    <>
      {/* --- Enhanced Background with NEW PALETTE --- */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-[#282A36]">
        <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_6rem] dark:bg-[linear-gradient(to_right,#44475A40_1px,transparent_1px),linear-gradient(to_bottom,#44475A40_1px,transparent_1px)]"></div>
        <div className="fixed inset-0 -z-9 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(120,81,255,0.15),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(189,147,249,0.1),_transparent_50%)]"></div>
        <div className="fixed inset-0 -z-9 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.1),_transparent_40%)] dark:bg-[radial-gradient(circle_at_bottom_left,_rgba(139,233,253,0.1),_transparent_50%)]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden text-slate-800 dark:text-[#F8F8F2] font-sans">
        
        {/* --- Header with NEW PALETTE --- */}
        <header className="sticky top-0 z-50 w-full px-4 lg:px-8 h-20 flex items-center justify-center bg-white/80 dark:bg-[#282A36]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#44475A] shadow-sm">
          <div className="flex items-center justify-between w-full max-w-7xl">
            <a className="flex items-center group" href="#">
              <GraduationCap className="h-8 w-8 text-[#8BE9FD]" />
              <span className="ml-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Lumo</span>
            </a>
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="link" onClick={() => scrollToSection('detailed-features')} className="text-lg text-slate-600 dark:text-[#F8F8F2]/90 hover:text-[#BD93F9] transition-colors duration-200">Features</Button>
              <Button variant="link" onClick={() => scrollToSection('how-it-works')} className="text-lg text-slate-600 dark:text-[#F8F8F2]/90 hover:text-[#BD93F9] transition-colors duration-200">How It Works</Button>
              <Button variant="link" onClick={() => router.push('/institutional-portal')} className="text-lg text-slate-600 dark:text-[#F8F8F2]/90 hover:text-[#BD93F9] transition-colors duration-200">Institutional Portal</Button>
              <Button variant="ghost" onClick={() => router.push('/auth/signin')} className="text-lg text-slate-600 dark:text-[#F8F8F2]/90 hover:bg-slate-100 dark:hover:bg-[#44475A] rounded-xl px-5 py-2">Sign In</Button>
              <Button onClick={() => router.push('/auth/signup')} className={primaryButtonStyle}>Join Now <ChevronRight className="h-5 w-5"/></Button>
              <ThemeToggle />
            </nav>
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu"><Menu className="h-7 w-7"/></Button>
            </div>
          </div>
        </header>
        
        {/* Mobile Menu with NEW PALETTE */}
        <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-0 z-[100] bg-white dark:bg-[#282A36] p-6 md:hidden"
              >
                <div className="flex justify-between items-center mb-10">
                  <a className="flex items-center group" href="#">
                    <GraduationCap className="h-8 w-8 text-[#8BE9FD]" />
                    <span className="ml-3 text-3xl font-extrabold">Lumo</span>
                  </a>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu"><X className="h-7 w-7"/></Button>
                </div>
                <nav className="flex flex-col gap-6">
                  <Button variant="ghost" className="w-full justify-start text-xl p-4 dark:hover:bg-[#44475A] rounded-xl" onClick={() => scrollToSection('detailed-features')}>Features</Button>
                  <Button variant="ghost" className="w-full justify-start text-xl p-4 dark:hover:bg-[#44475A] rounded-xl" onClick={() => scrollToSection('how-it-works')}>How It Works</Button>
                  <Button variant="ghost" className="w-full justify-start text-xl p-4 dark:hover:bg-[#44475A] rounded-xl" onClick={() => navigateAndCloseMenu('/institutional-portal')}>Institutional Portal</Button>
                  <Button variant="ghost" className="w-full justify-start text-xl p-4 dark:hover:bg-[#44475A] rounded-xl" onClick={() => navigateAndCloseMenu('/auth/signin')}>Sign In</Button>
                  <Button onClick={() => navigateAndCloseMenu('/auth/signup')} className={primaryButtonStyle + " w-full justify-center text-xl p-4"}>Join Now <ChevronRight className="h-6 w-6 ml-2" /></Button>
                </nav>
              </motion.div>
            )}
        </AnimatePresence>

        <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl">

            {/* --- 1. Hero Section with NEW PALETTE --- */}
            <section id="hero" className="w-full py-32 md:py-48 flex flex-col items-center text-center">
              <motion.div variants={fadeIn('down', 0.2, 0.8, 60)} initial="hidden" animate="show">
                <a href="#ai-features" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF79C6] to-[#BD93F9] rounded-full px-4 py-2 text-base text-white mb-6 transition-transform hover:scale-105 shadow-lg hover:shadow-[#BD93F9]/40">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" /> Your Personal Learning Co-Pilot
                </a>
              </motion.div>
              <motion.h1 variants={fadeIn('down', 0.4, 0.9, 60)} initial="hidden" animate="show" className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl text-slate-900 dark:text-[#F8F8F2] leading-tight mb-8">
                Chart Your Learning Path <br className="hidden md:block"/> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF79C6] to-[#BD93F9]">Intelligent AI</span>
              </motion.h1>
              <motion.p variants={fadeIn('down', 0.6, 1.0, 60)} initial="hidden" animate="show" className="mx-auto max-w-3xl text-xl text-slate-600 dark:text-[#F8F8F2]/80 md:text-2xl leading-relaxed mb-12">
                Lumo is more than an e-learning platform. It's your personal academic partner, crafting a unique journey for you, online and off, ensuring mastery and growth.
              </motion.p>
              <motion.div variants={fadeIn('up', 0.8, 1.1, 60)} initial="hidden" animate="show" className="flex flex-col sm:flex-row gap-5">
                <Button onClick={() => router.push('/auth/signup')} className={primaryButtonStyle + " text-lg"}>
                  Start Your Journey <ChevronRight className="h-6 w-6" />
                </Button>
                <Button onClick={() => scrollToSection('detailed-features')} variant="ghost" className={secondaryButtonStyle + " text-lg"}>
                  Explore Features
                </Button>
              </motion.div>
            </section>

            {/* --- 2. Pillar Features Section (Brief Overview) --- */}
            <section id="features" className="w-full py-24 md:py-36">
              <motion.div variants={staggerContainer(0.15)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="grid md:grid-cols-2 gap-10">
                <ValuePropCard
                  icon={Bot}
                  tagline="Intelligent Learning"
                  title="Your Personal AI Study Planner"
                  description="Stop guessing what to study next. Lumo's AI analyzes your progress, pinpoints knowledge gaps, and builds an optimized study schedule to maximize your learning efficiency."
                />
                <ValuePropCard
                  icon={WifiOff}
                  tagline="Uninterrupted Access"
                  title="Learn Anywhere, Even Offline"
                  description="No internet? No problem. Download courses, track your progress, and complete lessons offline. Lumo syncs everything automatically when you're back online."
                />
              </motion.div>
            </section>

            {/* --- 3. AI Insights Showcase (Brief Overview) --- */}
            <section id="ai-features" className="w-full py-24 md:py-36">
               <motion.div variants={fadeIn('down', 0, 0.8, 60)} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center max-w-4xl mx-auto">
                 <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-[#F8F8F2] leading-tight mb-6">Make Learning Truly Personal</h2>
                 <p className="text-xl text-slate-600 dark:text-[#F8F8F2]/80 leading-relaxed">Lumo doesn't just give you content; it provides actionable insights to help you grow and master any subject.</p>
              </motion.div>

              <motion.div variants={staggerContainer(0.2)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="mt-20 grid lg:grid-cols-3 gap-10 items-start">
                <div className="lg:col-span-1 space-y-8">
                   <AIInsightCard insightType="strength" text="You've mastered 'Newton's First Law' with a 95% quiz accuracy. Keep up the great work!"/>
                   <AIInsightCard insightType="weakness" text="Struggling with 'Chemical Bonding'. Recommended review of Chapter 3 and additional practice problems."/>
                   <AIInsightCard insightType="strength" text="Excellent time management this week, completing all study goals and exceeding expectations."/>
                </div>
                <motion.div variants={fadeIn('up', 0.4, 1.0, 60)} className="lg:col-span-2 aspect-[16/10] bg-slate-100 dark:bg-[#44475A]/40 rounded-3xl shadow-2xl p-3 border border-slate-200 dark:border-[#6272A4]/60 overflow-hidden">
                   {/* Placeholder for AI Dashboard Screenshot */}
                   <img src="/placeholder-ai-dashboard.png" alt="Lumo AI Dashboard showing recommendations and insights" className="w-full h-full object-cover rounded-2xl" />
                </motion.div>
              </motion.div>
            </section>

            {/* --- NEW: Detailed Features Section with Tabs --- */}
            <section id="detailed-features" className="w-full py-24 md:py-36">
              <motion.div variants={fadeIn('down', 0, 0.8, 60)} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center max-w-4xl mx-auto mb-20">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-[#F8F8F2] leading-tight mb-6">Explore Lumo's Full Potential</h2>
                <p className="text-xl text-slate-600 dark:text-[#F8F8F2]/80 leading-relaxed">Dive deeper into the powerful features that make Lumo your ultimate learning companion.</p>
              </motion.div>

              <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
                <Tabs defaultValue="ai-powered" className="w-full">
                  <TabsList className="flex w-full overflow-x-auto whitespace-nowrap gap-3 mb-12 bg-slate-100 dark:bg-[#44475A] p-3 rounded-xl shadow-inner md:grid md:grid-cols-6 md:overflow-x-hidden md:whitespace-normal">
                    <TabsTrigger value="ai-powered" className="flex flex-shrink-0 flex-col items-center justify-center gap-2 p-3 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF79C6] data-[state=active]:to-[#BD93F9] data-[state=active]:text-white rounded-lg transition-all duration-200">
                      <BrainCircuit className="h-6 w-6" /> <span>AI-Powered</span>
                    </TabsTrigger>
                    <TabsTrigger value="offline-learning" className="flex flex-shrink-0 flex-col items-center justify-center gap-2 p-3 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF79C6] data-[state=active]:to-[#BD93F9] data-[state=active]:text-white rounded-lg transition-all duration-200">
                      <CloudOff className="h-6 w-6" /> <span>Offline</span>
                    </TabsTrigger>
                    <TabsTrigger value="content-ecosystem" className="flex flex-shrink-0 flex-col items-center justify-center gap-2 p-3 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF79C6] data-[state=active]:to-[#BD93F9] data-[state=active]:text-white rounded-lg transition-all duration-200">
                      <Book className="h-6 w-6" /> <span>Content</span>
                    </TabsTrigger>
                    <TabsTrigger value="progress-engagement" className="flex flex-shrink-0 flex-col items-center justify-center gap-2 p-3 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF79C6] data-[state=active]:to-[#BD93F9] data-[state=active]:text-white rounded-lg transition-all duration-200">
                      <Award className="h-6 w-6" /> <span>Progress</span>
                    </TabsTrigger>
                    <TabsTrigger value="community-support" className="flex flex-shrink-0 flex-col items-center justify-center gap-2 p-3 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF79C6] data-[state=active]:to-[#BD93F9] data-[state=active]:text-white rounded-lg transition-all duration-200">
                      <MessageSquare className="h-6 w-6" /> <span>Community</span>
                    </TabsTrigger>
                    <TabsTrigger value="monetization" className="flex flex-shrink-0 flex-col items-center justify-center gap-2 p-3 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF79C6] data-[state=active]:to-[#BD93F9] data-[state=active]:text-white rounded-lg transition-all duration-200">
                      <DollarSign className="h-6 w-6" /> <span>Monetization</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* AI-Powered Learning Tab */}
                  <TabsContent value="ai-powered" className="p-8 md:p-12 bg-white dark:bg-[#282A36] rounded-2xl shadow-xl border border-slate-200 dark:border-[#44475A]">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-[#F8F8F2] mb-6 flex items-center gap-3">
                      <BrainCircuit className="h-8 w-8 text-[#BD93F9]" /> AI-Powered Personalized Learning
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/80 leading-relaxed mb-10">
                      Lumo leverages advanced Artificial Intelligence to transform your learning experience from generic to truly personal. Our AI acts as your dedicated academic co-pilot, understanding your unique learning style, strengths, and areas for improvement.
                    </p>
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                      <div>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <Target className="h-6 w-6 text-[#8BE9FD]" /> Smart Study Planning
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Never wonder what to study next. Our AI analyzes your performance on quizzes, your engagement with content, and your learning pace to generate a dynamic, optimized study schedule. It identifies knowledge gaps and recommends specific content to reinforce your understanding, ensuring you focus on what matters most.
                        </p>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <Sparkles className="h-6 w-6 text-[#8BE9FD]" /> Intelligent Content Recommendations
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Beyond just planning, Lumo's AI suggests relevant courses, chapters, and individual content pieces tailored to your needs. Whether it's a new topic to explore or a concept that needs revisiting, our AI ensures you're always presented with the most impactful learning materials.
                        </p>
                      </div>
                      <div className="flex justify-center items-center bg-slate-100 dark:bg-[#44475A]/40 rounded-xl p-4 shadow-inner">
                        {/* Placeholder for AI Study Planner/Recommendations Screenshot */}
                        <img src="/placeholder-ai-features.png" alt="AI-Powered Study Planner and Recommendations" className="max-w-full h-auto rounded-lg shadow-md" />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Offline Learning Tab */}
                  <TabsContent value="offline-learning" className="p-8 md:p-12 bg-white dark:bg-[#282A36] rounded-2xl shadow-xl border border-slate-200 dark:border-[#44475A]">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-[#F8F8F2] mb-6 flex items-center gap-3">
                      <CloudOff className="h-8 w-8 text-[#BD93F9]" /> Seamless Offline Learning
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/80 leading-relaxed mb-10">
                      Your learning shouldn't stop when your internet connection does. Lumo is designed with robust offline capabilities, allowing you to download entire courses and content packages directly to your device.
                    </p>
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                      <div className="flex justify-center items-center bg-slate-100 dark:bg-[#44475A]/40 rounded-xl p-4 shadow-inner">
                        {/* Placeholder for Offline Content Download Screenshot */}
                        <img src="/placeholder-offline-download.png" alt="Offline Content Download Interface" className="max-w-full h-auto rounded-lg shadow-md" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <WifiOff className="h-6 w-6 text-[#8BE9FD]" /> Learn Anywhere, Anytime
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Whether you're on a long commute, in an area with spotty Wi-Fi, or simply want to save data, Lumo ensures your educational journey remains uninterrupted. Download videos, documents, quizzes, and more, and access them without an internet connection.
                        </p>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <CheckCircle className="h-6 w-6 text-[#8BE9FD]" /> Automatic Sync & Progress Tracking
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          All your progress, quiz attempts, notes, and highlights made offline are securely stored on your device. The moment you reconnect to the internet, Lumo automatically syncs all your activities with your online profile, ensuring your learning path is always up-to-date across all your devices.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Content Ecosystem Tab */}
                  <TabsContent value="content-ecosystem" className="p-8 md:p-12 bg-white dark:bg-[#282A36] rounded-2xl shadow-xl border border-slate-200 dark:border-[#44475A]">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-[#F8F8F2] mb-6 flex items-center gap-3">
                      <Book className="h-8 w-8 text-[#BD93F9]" /> Rich Content Ecosystem
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/80 leading-relaxed mb-10">
                      Lumo provides a comprehensive Content Management System (CMS) that supports a wide array of educational materials, structured to facilitate effective learning.
                    </p>
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                      <div>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <Layers className="h-6 w-6 text-[#8BE9FD]" /> Structured Learning Paths
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Content is organized hierarchically from Institutions and Departments down to Courses, Chapters, and individual Content items. This clear structure helps you navigate complex subjects and understand the progression of knowledge.
                        </p>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <BookOpen className="h-6 w-6 text-[#8BE9FD]" /> Diverse Content Types
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Engage with a variety of content formats including rich text, interactive videos, images, audio lectures, quizzes, flashcards, downloadable documents, code snippets, and embedded external resources. This multi-modal approach caters to different learning preferences.
                        </p>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <PenSquare className="h-6 w-6 text-[#8BE9FD]" /> Interactive Quizzes & Flashcards
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Test your knowledge and reinforce concepts with built-in quizzes and flashcards. These tools are integrated directly into your learning path, providing immediate feedback and aiding memory retention.
                        </p>
                      </div>
                      <div className="flex justify-center items-center bg-slate-100 dark:bg-[#44475A]/40 rounded-xl p-4 shadow-inner">
                        {/* Placeholder for Content Ecosystem Screenshot (e.g., course page with various content types) */}
                        <img src="/placeholder-content-ecosystem.png" alt="Lumo Content Management System and Course Structure" className="max-w-full h-auto rounded-lg shadow-md" />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Progress & Engagement Tab */}
                  <TabsContent value="progress-engagement" className="p-8 md:p-12 bg-white dark:bg-[#282A36] rounded-2xl shadow-xl border border-slate-200 dark:border-[#44475A]">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-[#F8F8F2] mb-6 flex items-center gap-3">
                      <Award className="h-8 w-8 text-[#BD93F9]" /> Progress Tracking & Engagement
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/80 leading-relaxed mb-10">
                      Lumo is designed to keep you motivated and informed about your learning journey, with detailed progress tracking and engaging gamification elements.
                    </p>
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                      <div className="flex justify-center items-center bg-slate-100 dark:bg-[#44475A]/40 rounded-xl p-4 shadow-inner">
                        {/* Placeholder for Progress Tracking/Gamification Screenshot */}
                        <img src="/placeholder-progress-gamification.png" alt="User Progress and Gamification Dashboard" className="max-w-full h-auto rounded-lg shadow-md" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <BarChart className="h-6 w-6 text-[#8BE9FD]" /> Comprehensive Progress Analytics
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Monitor your completion rates, quiz scores, and time spent on each topic. Our intuitive dashboards provide clear insights into your learning habits and performance, helping you identify areas of strength and those needing more attention.
                        </p>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <Award className="h-6 w-6 text-[#8BE9FD]" /> Achievements, Badges & Certificates
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Stay motivated with a system of achievements, collectible badges, and verifiable certificates upon course completion. Celebrate your milestones and showcase your accomplishments.
                        </p>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <Settings className="h-6 w-6 text-[#8BE9FD]" /> Personalized Study Tools
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Enhance your study sessions with integrated tools like digital bookmarks, note-taking features, text highlighting, and annotations. These tools help you actively engage with content and personalize your learning materials.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Community & Support Tab */}
                  <TabsContent value="community-support" className="p-8 md:p-12 bg-white dark:bg-[#282A36] rounded-2xl shadow-xl border border-slate-200 dark:border-[#44475A]">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-[#F8F8F2] mb-6 flex items-center gap-3">
                      <MessageSquare className="h-8 w-8 text-[#BD93F9]" /> Community & Support
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/80 leading-relaxed mb-10">
                      Lumo fosters a collaborative learning environment and ensures you have the support you need throughout your educational journey.
                    </p>
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                      <div>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <Users className="h-6 w-6 text-[#8BE9FD]" /> Reviews, Ratings & Comments
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Share your insights and learn from others by leaving reviews, ratings, and comments on courses and content. Engage in discussions, ask questions, and contribute to a vibrant learning community.
                        </p>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <Mail className="h-6 w-6 text-[#8BE9FD]" /> Internal Messaging & Notifications
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Communicate directly with instructors and fellow students through our secure internal messaging system. Receive timely notifications about course updates, new content, and community interactions.
                        </p>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <AlertTriangle className="h-6 w-6 text-[#8BE9FD]" /> Reporting & Feedback
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Easily report issues or provide feedback on content and platform features. Your input helps us continuously improve Lumo and ensure a high-quality learning experience for everyone.
                        </p>
                      </div>
                      <div className="flex justify-center items-center bg-slate-100 dark:bg-[#44475A]/40 rounded-xl p-4 shadow-inner">
                        {/* Placeholder for Community/Messaging Screenshot */}
                        <img src="/placeholder-community.png" alt="Lumo Community Features and Messaging" className="max-w-full h-auto rounded-lg shadow-md" />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Monetization Tab */}
                  <TabsContent value="monetization" className="p-8 md:p-12 bg-white dark:bg-[#282A36] rounded-2xl shadow-xl border border-slate-200 dark:border-[#44475A]">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-[#F8F8F2] mb-6 flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-[#BD93F9]" /> Flexible Monetization Options
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/80 leading-relaxed mb-10">
                      Lumo provides robust features for managing subscriptions and payments, offering flexibility for both learners and content creators.
                    </p>
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                      <div className="flex justify-center items-center bg-slate-100 dark:bg-[#44475A]/40 rounded-xl p-4 shadow-inner">
                        {/* Placeholder for Subscription/Payment Screenshot */}
                        <img src="/placeholder-monetization.png" alt="Subscription and Payment Management" className="max-w-full h-auto rounded-lg shadow-md" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <Search className="h-6 w-6 text-[#8BE9FD]" /> Subscription Management
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Access premium content or entire course libraries through flexible subscription plans. Manage your subscriptions, view billing history, and easily upgrade or downgrade your plans directly within the platform.
                        </p>
                        <h4 className="text-2xl font-semibold text-slate-900 dark:text-[#F8F8F2] mb-4 flex items-center gap-2">
                          <DollarSign className="h-6 w-6 text-[#8BE9FD]" /> Secure Payment Processing
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed mb-6">
                          Our integrated payment system ensures secure and seamless transactions for course purchases or subscription renewals. Track your payment history and manage your payment methods with ease.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                </Tabs>
              </motion.div>
            </section>

            {/* --- 4. How It Works with NEW PALETTE --- */}
            <section id="how-it-works" className="w-full py-24 md:py-36">
              <motion.h2 variants={fadeIn('down', 0, 0.8, 60)} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center leading-tight mb-20 text-slate-900 dark:text-[#F8F8F2]">
                Your Journey to Mastery
              </motion.h2>
              <motion.div variants={staggerContainer(0.15)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-10">
                   <svg width="100%" height="2" preserveAspectRatio="none"><path d="M0,1 H1000" stroke="currentColor" strokeWidth="2" strokeDasharray="8, 8" className="text-slate-300 dark:text-[#6272A4]"/></svg>
                </div>
                <StepCard number="1" icon={BrainCircuit} title="Analyze & Plan" description="Lumo's AI assesses your skills and creates a personalized, adaptive study plan." delay={0}/>
                <StepCard number="2" icon={Layers} title="Learn & Interact" description="Engage with a rich ecosystem of content—simulations, quizzes, and more, online or off." delay={0.1}/>
                <StepCard number="3" icon={BarChart} title="Achieve & Grow" description="Track your progress with detailed analytics and watch your knowledge grow." delay={0.2}/>
              </motion.div>
            </section>
            
            {/* --- 5. CTA Section with NEW PALETTE --- */}
            <section id="cta" className="w-full py-24 md:py-36 my-16">
              <motion.div
                variants={fadeIn('up', 0, 1.0, 60)} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="relative text-center bg-gradient-to-r from-[#6272A4] to-[#44475A] rounded-3xl p-12 md:p-20 overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-20"></div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#F8F8F2] mb-6">Ready to Unlock Your Potential?</h2>
                <p className="text-xl text-[#F8F8F2]/80 max-w-3xl mx-auto mb-10">Join the growing community of learners who are studying smarter, not just harder, with Lumo.</p>
                <Button onClick={() => router.push('/auth/signup')} className="bg-[#F8F8F2] text-[#282A36] font-bold text-xl px-10 py-4 rounded-xl transition-transform hover:scale-105 shadow-2xl">
                    Get Started for Free
                </Button>
              </motion.div>
            </section>

          </div>
        </main>
        
        {/* --- Footer with NEW PALETTE --- */}
        <footer className="w-full pt-20 pb-10 border-t border-slate-200 dark:border-[#44475A] bg-white dark:bg-[#282A36]">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
                  <div className="col-span-2 lg:col-span-1">
                    <a className="flex items-center group mb-3" href="#">
                      <GraduationCap className="h-8 w-8 text-[#8BE9FD]" />
                      <span className="ml-3 text-3xl font-extrabold">Lumo</span>
                    </a>
                    <p className="text-base text-slate-500 dark:text-[#6272A4] leading-relaxed">Your personal AI learning co-pilot.</p>
                  </div>
                  {[
                    { title: 'Product', links: [{ name: 'Features', href: '#detailed-features'}, { name: 'Pricing', href: '#'}, { name: 'For Schools', href: '#'}] },
                    { title: 'Company', links: [{ name: 'About Us', href: '#'}, { name: 'Careers', href: '#'}, { name: 'Contact', href: '#'}] },
                    { title: 'Legal', links: [{ name: 'Terms', href: '#'}, { name: 'Privacy', href: '#'}] }
                  ].map(group => (
                    <div key={group.title}>
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-[#F8F8F2] mb-4">{group.title}</h3>
                        <nav className="flex flex-col gap-3">
                            {group.links.map(link => (
                                <a key={link.name} href={link.href} onClick={(e)=>{if(link.href.startsWith('#')){e.preventDefault(); scrollToSection(link.href.substring(1))}}} className="text-base text-slate-500 dark:text-[#6272A4] hover:text-[#BD93F9] transition-colors duration-200">{link.name}</a>
                            ))}
                        </nav>
                    </div>
                  ))}
              </div>
              <div className="pt-10 border-t border-slate-200 dark:border-[#44475A] text-center text-base text-slate-500 dark:text-[#6272A4]">
                <p>© {new Date().getFullYear()} Lumo (by ASCII Technologies). All rights reserved.</p>
              </div>
            </div>
        </footer>

      </div>
    </>
  );
}

// --- Reusable Components with NEW PALETTE ---

function ValuePropCard({ icon: Icon, tagline, title, description }: { icon: React.ElementType, tagline: string, title: string, description: string }) {
  return (
    <motion.div variants={fadeIn('up', 0, 0.9, 40)} className="bg-gradient-to-br from-white to-slate-50 dark:bg-[#44475A] p-8 rounded-3xl border border-slate-200 dark:border-[#6272A4]/60 h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-5 inline-flex items-center gap-3">
        <Icon className="h-7 w-7 text-[#8BE9FD]" />
        <span className="font-semibold text-base text-blue-600 dark:text-[#8BE9FD]">{tagline}</span>
      </div>
      <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-[#F8F8F2] leading-tight">{title}</h3>
      <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function AIInsightCard({ insightType, text }: { insightType: 'strength' | 'weakness', text: string }) {
  const isStrength = insightType === 'strength';
  const Icon = isStrength ? CheckCircle2 : AlertTriangle;
  const iconColor = isStrength ? 'text-[#50FA7B]' : 'text-[#FFB86C]';
  const bgColor = isStrength ? 'bg-[#50FA7B]/10' : 'bg-[#FFB86C]/10';
  
  return (
    <motion.div variants={fadeIn('right', 0, 0.8, 40)} className={`flex items-start gap-5 p-6 rounded-2xl border dark:border-[#6272A4]/50 ${bgColor} shadow-md`}>
      <Icon className={`h-7 w-7 mt-0.5 shrink-0 ${iconColor}`} />
      <p className="text-lg text-slate-700 dark:text-[#F8F8F2]/90 leading-relaxed">{text}</p>
    </motion.div>
  );
}

function StepCard({ number, icon: Icon, title, description, delay = 0 }: { number: string, icon: React.ElementType, title: string, description: string, delay?: number }) {
  return (
    <motion.div variants={fadeIn('up', delay, 0.9, 40)} className="relative z-10">
      <div className="mb-6 inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-white dark:bg-[#44475A] border border-slate-200 dark:border-[#6272A4]/80 shadow-lg">
        <Icon className="h-10 w-10 text-[#BD93F9]" />
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-[#F8F8F2] leading-tight">{title}</h3>
      <p className="text-lg text-slate-500 dark:text-[#6272A4] leading-relaxed max-w-xs mx-auto">{description}
</p>
    </motion.div>
  );
}
