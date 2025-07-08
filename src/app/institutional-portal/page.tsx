"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, ChevronRight, Palette, UploadCloud, BarChart3, Award, Users, ShieldCheck, X
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { ThemeToggle } from '@/components/theme-toggle';


// --- Animation Variants ---
const fadeIn = (direction = 'up', delay = 0, duration = 0.8, yStart = 40) => ({
  hidden: { opacity: 0, y: yStart },
  show: { opacity: 1, y: 0, transition: { type: 'spring', duration, delay, ease: 'easeOut', bounce: 0.25 } }
});
const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } }
});
const modalBackdrop = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3 } }
};
const modalContent = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', duration: 0.5, ease: 'easeOut', bounce: 0.2 } }
};

// --- Demo Request Modal Component ---
function DemoRequestModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const primaryButtonStyle = "bg-gradient-to-r from-[#FF79C6] to-[#BD93F9] hover:opacity-90 text-white font-semibold py-3 px-8 rounded-xl inline-flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-[#BD93F9]/30 text-lg w-full";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    variants={modalBackdrop} initial="hidden" animate="show" exit="hidden"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div 
                        variants={modalContent} 
                        className="relative w-full max-w-lg p-8 bg-white dark:bg-[#282A36] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#44475A]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white" onClick={onClose}>
                            <X className="h-6 w-6" />
                        </Button>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-[#F8F8F2] mb-4">Request a Demo</h2>
                        <p className="text-slate-600 dark:text-[#F8F8F2]/70 mb-8">Fill out the form below and our team will get back to you shortly to schedule a personalized demo.</p>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                <Input id="name" type="text" placeholder="e.g., Jane Doe" className="dark:bg-[#44475A] dark:border-[#6272A4] dark:placeholder:text-slate-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Work Email</label>
                                <Input id="email" type="email" placeholder="e.g., jane.doe@university.edu" className="dark:bg-[#44475A] dark:border-[#6272A4] dark:placeholder:text-slate-500" />
                            </div>
                            <div>
                                <label htmlFor="institution" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Institution / Organization</label>
                                <Input id="institution" type="text" placeholder="e.g., University of Excellence" className="dark:bg-[#44475A] dark:border-[#6272A4] dark:placeholder:text-slate-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message (Optional)</label>
                                <Textarea id="message" placeholder="Tell us about your needs..." className="dark:bg-[#44475A] dark:border-[#6272A4] dark:placeholder:text-slate-500" />
                            </div>
                            <Button type="submit" className={primaryButtonStyle}>Submit Request</Button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function InstitutionalPortalPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const primaryButtonStyle = "bg-gradient-to-r from-[#FF79C6] to-[#BD93F9] hover:opacity-90 text-white font-semibold py-3 px-8 rounded-xl inline-flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-[#BD93F9]/30 text-lg";
  const secondaryButtonStyle = "bg-white/10 dark:bg-[#44475A]/70 border border-slate-300 dark:border-[#6272A4]/50 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-[#44475A] text-slate-800 dark:text-[#F8F8F2] font-semibold py-3 px-8 rounded-xl inline-flex items-center gap-2 transition-all duration-300 ease-in-out text-lg";

  return (
    <>
      <DemoRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* --- Enhanced Background --- */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-[#282A36]">
        <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_6rem] dark:bg-[linear-gradient(to_right,#44475A40_1px,transparent_1px),linear-gradient(to_bottom,#44475A40_1px,transparent_1px)]"></div>
        <div className="fixed inset-0 -z-9 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(120,81,255,0.15),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(189,147,249,0.1),_transparent_50%)]"></div>
        <div className="fixed inset-0 -z-9 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.1),_transparent_40%)] dark:bg-[radial-gradient(circle_at_bottom_left,_rgba(139,233,253,0.1),_transparent_50%)]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden text-slate-800 dark:text-[#F8F8F2] font-sans">
        
        {/* --- Header --- */}
        <header className="sticky top-0 z-50 w-full px-4 lg:px-8 h-20 flex items-center justify-center bg-white/80 dark:bg-[#282A36]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#44475A] shadow-sm">
          <div className="flex items-center justify-between w-full max-w-7xl">
            <a className="flex items-center group" href="/">
              <GraduationCap className="h-8 w-8 text-[#8BE9FD]" />
              <span className="ml-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Lumo</span>
            </a>
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push('/auth/signin')} className="text-lg text-slate-600 dark:text-[#F8F8F2]/90 hover:bg-slate-100 dark:hover:bg-[#44475A] rounded-xl px-5 py-2">Sign In</Button>
                <Button onClick={() => router.push('/auth/signup')} className={primaryButtonStyle}>Join Now <ChevronRight className="h-5 w-5"/></Button>
                <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl">

            {/* --- Hero Section --- */}
            <section className="w-full py-32 md:py-48 flex flex-col items-center text-center">
              <motion.h1 variants={fadeIn('down', 0.2, 0.9, 60)} initial="hidden" animate="show" className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl text-slate-900 dark:text-[#F8F8F2] leading-tight mb-8">
                Your Brand, Your Content, <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF79C6] to-[#BD93F9]">Our Platform</span>
              </motion.h1>
              <motion.p variants={fadeIn('down', 0.4, 1.0, 60)} initial="hidden" animate="show" className="mx-auto max-w-3xl text-xl text-slate-600 dark:text-[#F8F8F2]/80 md:text-2xl leading-relaxed mb-12">
                Empower your organization with a state-of-the-art, white-labeled learning portal. Lumo provides the technology to distribute your proprietary materials in a modern, engaging, and fully-branded environment.
              </motion.p>
              <motion.div variants={fadeIn('up', 0.6, 1.1, 60)} initial="hidden" animate="show" className="flex flex-col sm:flex-row gap-5">
                <Button className={primaryButtonStyle} onClick={() => setIsModalOpen(true)}>Request a Demo <ChevronRight className="h-6 w-6" /></Button>
                <Button variant="ghost" className={secondaryButtonStyle}>View Pricing</Button>
              </motion.div>
            </section>

            {/* --- Trusted By Section --- */}
            <section className="w-full pb-24">
                <motion.div variants={fadeIn('up', 0, 0.8, 40)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <h3 className="text-center text-xl font-medium text-slate-500 dark:text-slate-400 mb-8">TRUSTED BY LEADING INSTITUTIONS</h3>
                    <div className="flex justify-center items-center gap-12 md:gap-16 flex-wrap opacity-70">
                        <img src="/logos/mor-ethiopia-logo.png" alt="Ministry of Revenue Logo" className="h-12 md:h-14 object-contain"/>
                        <img src="/images/aastu-logo.png" alt="Addis Ababa University Logo" className="h-12 md:h-14 object-contain"/>
                        {/* Add more logos here */}
                    </div>
                </motion.div>
            </section>

            {/* --- Core Feature Showcase --- */}
            <section className="w-full py-24 md:py-36">
                <motion.div variants={fadeIn('down', 0, 0.8, 60)} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center max-w-4xl mx-auto mb-20">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-[#F8F8F2] leading-tight mb-6">A Fully-Featured Educational Ecosystem</h2>
                    <p className="text-xl text-slate-600 dark:text-[#F8F8F2]/80 leading-relaxed">We provide all the tools you need to manage, deliver, and track your educational content seamlessly.</p>
                </motion.div>
                <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <FeatureCard 
                        icon={Palette} 
                        title="Custom Branding & Identity" 
                        description="Deploy a portal that is uniquely yours. Customize the logo, color scheme, and use a unique portal key for a branded URL (e.g., your-org.lumo.com)." 
                    />
                    <FeatureCard 
                        icon={UploadCloud} 
                        title="Powerful Content Management" 
                        description="Easily upload, organize, and manage your entire curriculum, including videos, documents, interactive quizzes, and other proprietary learning materials."
                    />
                    <FeatureCard 
                        icon={Users} 
                        title="Robust User Management" 
                        description="Control access with a powerful membership system. Assign roles like 'owner' and 'admin' to manage permissions and onboard your learners effortlessly."
                    />
                    <FeatureCard 
                        icon={BarChart3} 
                        title="Learner Analytics & Insights" 
                        description="Utilize a comprehensive administrator dashboard to track learner progress, course completion rates, quiz performance, and overall engagement."
                    />
                    <FeatureCard 
                        icon={Award} 
                        title="Automated & Verifiable Certification" 
                        description="Automatically issue secure, branded digital certificates to learners upon successful course completion, adding value and credibility to your programs."
                    />
                    <FeatureCard 
                        icon={ShieldCheck} 
                        title="Secure, Scalable & Supported" 
                        description="Our platform is built on a secure and scalable infrastructure, ensuring a reliable experience for your users. Subscription includes dedicated support."
                    />
                </motion.div>
            </section>

            {/* --- How It Works Section --- */}
            <section className="w-full py-24 md:py-36">
              <motion.h2 variants={fadeIn('down', 0, 0.8, 60)} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center leading-tight mb-20 text-slate-900 dark:text-[#F8F8F2]">
                Launch Your Portal in 4 Simple Steps
              </motion.h2>
              <motion.div variants={staggerContainer(0.15)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-10">
                   <svg width="100%" height="2" preserveAspectRatio="none"><path d="M0,1 H1000" stroke="currentColor" strokeWidth="2" strokeDasharray="8, 8" className="text-slate-300 dark:text-[#6272A4]"/></svg>
                </div>
                <StepCard number="1" title="Consult & Setup" description="We work with you to configure your portal's branding, custom URL, and subscription plan." delay={0}/>
                <StepCard number="2" title="Upload Content" description="Use our intuitive content management system to upload and organize your courses and materials." delay={0.1}/>
                <StepCard number="3" title="Onboard Users" description="Invite your learners and administrators to the platform and assign them appropriate roles and access levels." delay={0.2}/>
                <StepCard number="4" title="Launch & Analyze" description="Go live with your portal and start tracking engagement and performance with our powerful analytics dashboard." delay={0.3}/>
              </motion.div>
            </section>

            {/* --- Final CTA Section --- */}
            <section className="w-full py-24 md:py-36 my-16">
              <motion.div
                variants={fadeIn('up', 0, 1.0, 60)} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="relative text-center bg-gradient-to-r from-[#6272A4] to-[#44475A] rounded-3xl p-12 md:p-20 overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-20"></div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#F8F8F2] mb-6">Ready to Build Your Digital Learning Environment?</h2>
                <p className="text-xl text-[#F8F8F2]/80 max-w-3xl mx-auto mb-10">Let's discuss how Lumo can be tailored to your organization's unique needs. Schedule a free, no-obligation demo with our team today.</p>
                <Button className="bg-[#F8F8F2] text-[#282A36] font-bold text-xl px-10 py-4 rounded-xl transition-transform hover:scale-105 shadow-2xl" onClick={() => setIsModalOpen(true)}>
                    Request a Demo
                </Button>
              </motion.div>
            </section>

          </div>
        </main>
        
        {/* --- Footer --- */}
        <footer className="w-full pt-20 pb-10 border-t border-slate-200 dark:border-[#44475A] bg-white dark:bg-[#282A36]">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-base text-slate-500 dark:text-[#6272A4]">
                <p>© {new Date().getFullYear()} Lumo (by ASCII Technologies). All rights reserved.</p>
            </div>
        </footer>

      </div>
    </>
  );
}

// --- Reusable Components ---

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
    return (
      <motion.div variants={fadeIn('up', 0, 0.9, 40)} className="bg-gradient-to-br from-white to-slate-50 dark:bg-[#3A3C4E] p-8 rounded-3xl border border-slate-200 dark:border-[#6272A4]/60 h-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-r from-[#FF79C6]/20 to-[#BD93F9]/20">
          <Icon className="h-8 w-8 text-[#BD93F9]" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-[#F8F8F2] leading-tight">{title}</h3>
        <p className="text-lg text-slate-600 dark:text-[#F8F8F2]/70 leading-relaxed">{description}</p>
      </motion.div>
    );
}

function StepCard({ number, title, description, delay = 0 }: { number: string, title: string, description: string, delay?: number }) {
    return (
      <motion.div variants={fadeIn('up', delay, 0.9, 40)} className="relative z-10">
        <div className="mb-6 relative">
            <div className="relative inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-white dark:bg-[#44475A] border border-slate-200 dark:border-[#6272A4]/80 shadow-lg">
                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF79C6] to-[#BD93F9]">{number}</span>
            </div>
        </div>
        <h3 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-[#F8F8F2] leading-tight">{title}</h3>
        <p className="text-lg text-slate-500 dark:text-[#6272A4] leading-relaxed max-w-xs mx-auto">{description}</p>
      </motion.div>
    );
  }