/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    GraduationCap, Rocket, MoveRight, Menu, Sun, Moon,
    Beaker, BrainCircuit, Brush, AreaChart, Clock, BookOpenCheck, Users, Target, Phone, Mail,
    Zap, // Relevant icons
    ChevronDown // Added for scroll indicator
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useScroll, useTransform, Variants, TargetAndTransition } from "framer-motion";
import Link from 'next/link';
import dynamic from 'next/dynamic'; // Import dynamic for potential code splitting

// --- Theme Toggle Component ---
// Use dynamic import for components that might not be needed immediately or are heavy
// Example: const ThemeToggle = dynamic(() => import('@/components/theme-toggle').then(mod => mod.ThemeToggle), { ssr: false });
// For this example, we'll keep the direct import for simplicity unless ThemeToggle is complex.
import { ThemeToggle } from "@/components/theme-toggle";

// --- Fonts ---
// Assumed done in layout.tsx or globals.css

// --- Animation Variants (Refined) ---
const fadeIn: Variants = {
    hidden: { opacity: 0, y: 15 }, // Slightly increased y offset
    visible: (i: number = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' }, // Slightly longer duration
    }),
};

const scaleFadeIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number = 1) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
    }),
};


const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1, // Small delay before children start
        },
    },
};

// Button Hover Effects
const buttonGlowHover: TargetAndTransition = {
    scale: 1.05, // Slightly more scale
    filter: 'brightness(1.2) drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))', // Brighter + Purple/Blue glow
    transition: { duration: 0.2 }
};
const buttonGlowTap: TargetAndTransition = {
    scale: 0.95,
    filter: 'brightness(0.9)'
};

// --- Helper Components ---

interface SectionHeadingProps {
    text: string | React.ReactNode;
    level?: 'h1' | 'h2' | 'h3';
    className?: string;
    useChalkFont?: boolean;
    delay?: number;
    align?: 'left' | 'center' | 'right';
}
const SectionHeading: React.FC<SectionHeadingProps> = ({
    text, level = 'h2', className = "", useChalkFont = false, delay = 0, align = 'left'
}) => {
    const Tag = level;
    const fontClass = useChalkFont ? 'font-chalk' : 'font-heading';
    const alignClass = `text-${align}`;

    return (
        // Using scaleFadeIn for headings for a slightly different feel
        <motion.div
            variants={scaleFadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            custom={delay}
        >
            <Tag className={`font-semibold tracking-tight text-slate-900 dark:text-white ${fontClass} ${alignClass} ${className}`}>
                {text}
            </Tag>
        </motion.div>
    );
};

interface ThemedSectionProps {
    children: React.ReactNode;
    id?: string;
    background?: 'graph' | 'lined' | 'dots' | 'subtle-noise' | 'transparent';
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}
const ThemedSection: React.FC<ThemedSectionProps> = ({ children, id, background = 'transparent', className = "", as = 'section' }) => {
    const Tag = as;
    const bgClass = {
        graph: 'bg-graph-subtle',
        lined: 'bg-lined-subtle',
        dots: 'bg-dots-subtle',
        'subtle-noise': 'bg-noise-subtle',
        transparent: ''
    }[background];

    return (
        <Tag
            id={id}
            className={`w-full py-16 md:py-24 relative overflow-hidden ${bgClass} ${className}`}
        >
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Apply staggerContainer variant directly */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }} // Trigger when 20% is visible
                >
                    {children}
                </motion.div>
            </div>
        </Tag>
    );
}

interface InfoCardProps {
    children: React.ReactNode;
    className?: string;
    variants?: Variants;
    custom?: number; // Delay for stagger
    whileHover?: TargetAndTransition;
}
const InfoCard: React.FC<InfoCardProps> = ({ children, className = "", variants = fadeIn, custom, whileHover }) => {
    return (
        <motion.div
            // Refined Card Style: Softer shadow, consistent bg/border
            className={`p-6 rounded-xl border bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700/80 shadow-lg dark:shadow-slate-900/50 backdrop-blur-md h-full ${className}`}
            variants={variants}
            custom={custom} // Pass delay factor for staggering
            whileHover={whileHover}
        >
            {children}
        </motion.div>
    );
};

interface FeatureCardProps {
    Icon: React.FC<any>;
    title: string;
    text: string;
    custom: number; // Delay factor
}
const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, text, custom }) => {
    // Refined Hover: Slightly increased scale, more pronounced border
    const cardHoverEffect: TargetAndTransition = {
        y: -6,
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", // Enhanced shadow
        borderColor: "rgba(59, 130, 246, 0.5)", // Blue border hint
    };

    return (
        <InfoCard
            // Added transition class for smoother hover effects
            className="flex flex-col items-center text-center transition-all duration-300 ease-out hover:border-blue-400 dark:hover:border-blue-500"
            custom={custom}
            whileHover={cardHoverEffect}
        >
            <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/60 dark:to-purple-900/60">
                <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow">{text}</p>
        </InfoCard>
    );
};

// --- Main Landing Page Component ---
export default function LandingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const heroRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null); // Ref for the start of the main content

    // --- Smoother Reveal Transition ---
    const { scrollYProgress: contentRevealProgress } = useScroll({
        target: contentWrapperRef, // Target the content wrapper itself
        offset: ["start end", "start 0.7"] // Start animation when bottom of viewport hits top of section, end when 70% of section is scrolled past its top
    });

    // Fade In + Gentle Upward Movement for the *entire* content wrapper below hero
    const contentOpacity = useTransform(contentRevealProgress, [0, 0.5], [0, 1]); // Fade in over the first 50% of the trigger range
    const contentY = useTransform(contentRevealProgress, [0, 0.8], ["30px", "0px"]); // Move up slightly as it fades in
    const contentScale = useTransform(contentRevealProgress, [0, 1], [0.98, 1]); // Subtle scale up


    useEffect(() => {
        const savedTheme = localStorage.getItem('lumo-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) { document.documentElement.classList.add('dark'); }
        else { document.documentElement.classList.remove('dark'); }
    }, []);

    const handleSignIn = () => router.push("/auth/signin");
    const handleEarlyAccess = () => router.push("/auth/signup");
    const handleContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    const handleScrollDown = () => contentWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to the top of the content


    const features = [
        { Icon: Beaker, title: "Interactive Simulations", text: "Bring concepts like Chemistry & Physics to life with hands-on virtual experiments." },
        { Icon: BrainCircuit, title: "AI Tutor", text: "Get personalized explanations and 24/7 guidance adapting to your learning style." },
        { Icon: Brush, title: "Creator Studio", text: "Build custom lessons with text, video, quizzes, and more. For educators & students." },
        { Icon: AreaChart, title: "Progress Tracking", text: "Monitor your learning journey with detailed metrics and visual reports." },
        { Icon: Clock, title: "Focus Tools", text: "Build effective study habits using techniques like the Pomodoro timer." },
        { Icon: BookOpenCheck, title: "Rich Content", text: "Learn through visuals, audio, and interactions catering to diverse learning styles." }
    ];

    // Button hover styles
    const signInHoverEffect: TargetAndTransition = { scale: 1.05, y: -1 };
    const signInTapEffect: TargetAndTransition = { scale: 0.97 };
    const partnershipsHoverEffect: TargetAndTransition = { y: -2, scale: 1.03, filter: 'brightness(1.05)' }; // Slightly brighter
    const partnershipsTapEffect: TargetAndTransition = { scale: 0.98 };


    return (
        <div className="bg-gray-50 dark:bg-slate-950 min-h-screen flex flex-col overflow-x-hidden antialiased">

            {/* --- Header --- */}
            <motion.header
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                // Ensure header stays above hero content but below potential modals (z-40)
                className="sticky top-0 z-40 w-full h-16 flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-700/60 shadow-sm"
            >
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="ml-2 text-xl font-semibold font-heading text-slate-900 dark:text-slate-100">Lumo</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-600 dark:text-slate-300">Features</Button>
                        <Button variant="ghost" size="sm" onClick={handleContact} className="text-slate-600 dark:text-slate-300">Contact</Button>
                        {!session && (
                            <motion.div whileHover={signInHoverEffect} whileTap={signInTapEffect}>
                                <Button onClick={handleSignIn} size="sm" variant="outline" className="text-blue-600 border-blue-500/60 hover:bg-blue-50/70 hover:border-blue-500 dark:text-blue-400 dark:border-blue-400/60 dark:hover:bg-blue-900/30 dark:hover:border-blue-400/80 font-medium px-4">
                                    Sign In
                                </Button>
                            </motion.div>
                        )}
                        {/* Enhanced CTA Button */}
                        <motion.div
                            whileHover={buttonGlowHover} // Use defined hover effect
                            whileTap={buttonGlowTap}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg blur-sm opacity-60 group-hover:opacity-90 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                            <Button onClick={handleEarlyAccess} size="sm" className="relative px-4 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 dark:text-gray-950 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-400 dark:hover:to-purple-400 rounded-md shadow-md transition-all duration-300">
                                Get Early Access
                            </Button>
                        </motion.div>
                        <ThemeToggle />
                    </nav>
                    <div className="md:hidden flex items-center space-x-1">
                        <ThemeToggle />
                        <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
                    </div>
                </div>
            </motion.header>

            {/* --- Main Content --- */}
            <main className="flex-1">
                {/* Section 1: Hero */}
                <section
                    ref={heroRef}
                    // Removed sticky, as the content below will handle its own reveal
                    className="h-[calc(100vh-4rem)] min-h-[600px] max-h-[900px] w-full flex flex-col items-center justify-center z-10 bg-gradient-to-br from-slate-800 via-slate-900 to-black dark:from-slate-950 dark:via-black dark:to-black text-slate-100 overflow-hidden border-b-4 border-gray-400 dark:border-slate-700"
                >
                    <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                        <SectionHeading
                            level="h1"
                            text="Transforming Education in Ethiopia"
                            className="text-4xl md:text-5xl lg:text-6xl mb-4 !text-slate-100 drop-shadow-lg" // Enhanced shadow
                            useChalkFont={true}
                            align="center"
                            delay={0} // No stagger delay for H1
                        />
                        <motion.p
                            variants={fadeIn} initial="hidden" animate="visible" custom={1} // Stagger delay
                            className="font-sans text-lg md:text-xl text-slate-300 dark:text-gray-300 max-w-3xl mx-auto mt-2 mb-8"
                        >
                            Interactive, accessible learning tools designed for students & schools. Tackling low exam pass rates with modern solutions.
                        </motion.p>
                        <motion.div
                            variants={fadeIn} initial="hidden" animate="visible" custom={2} // Stagger delay
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            {/* Enhanced CTA Button */}
                            <motion.div
                                whileHover={buttonGlowHover} // Use defined hover effect
                                whileTap={buttonGlowTap}
                                className="relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                                <Button onClick={handleEarlyAccess} size="lg" className="relative text-lg px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 dark:text-gray-950 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-400 dark:hover:to-purple-400 rounded-lg shadow-lg transition-all duration-300">
                                    Get Early Access
                                    <Rocket className="ml-2.5 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                    {/* Scroll Down Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0] }} // Fade in and out
                        transition={{ delay: 2.5, duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-20"
                        onClick={handleScrollDown}
                        title="Scroll down"
                    >
                        <ChevronDown className="w-8 h-8 text-slate-400 hover:text-slate-200 transition-colors" />
                    </motion.div>
                    {/* Subtle Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent dark:from-black/40 pointer-events-none"></div>
                </section>


                {/* --- Content Wrapper for Reveal --- */}
                {/* Apply the reveal animation to this wrapper */}
                <motion.div
                    ref={contentWrapperRef} // Add the ref here
                    className="relative z-20 bg-gray-50 dark:bg-slate-900 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.4)]" // Subtle top shadow
                    style={{
                        opacity: contentOpacity,
                        y: contentY,
                        scale: contentScale
                    }}
                >
                    {/* Section 2: Ethiopia Focus */}
                    <ThemedSection id="ethiopia-focus" background="subtle-noise" className="pt-20 pb-16 md:pb-24">
                        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
                            {/* Text content uses default fadeIn from staggerContainer */}
                            <div className="order-2 md:order-1">
                                <SectionHeading text="Tailored for Ethiopia's Success" level="h2" className="text-3xl md:text-4xl mb-5" delay={1} />
                                <motion.p variants={fadeIn} custom={1.5} className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                                    Lumo directly addresses the educational hurdles Ethiopian students face, especially concerning Grade 12 national exam success rates. We aim to unlock potential and open doors to future opportunities.
                                </motion.p>
                                <InfoCard className="bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-slate-700 hover:shadow-blue-100/50 dark:hover:shadow-blue-900/50 transition-shadow" variants={fadeIn} custom={2}>
                                    <div className="flex items-start space-x-3">
                                        <Zap className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">Accessible Technology</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Designed to run efficiently on standard school computers via a lightweight OS, making modern learning feasible even with limited resources.</p>
                                        </div>
                                    </div>
                                </InfoCard>
                            </div>

                            {/* Illustration Placeholder */}
                            <motion.div variants={fadeIn} custom={1.5} className="order-1 md:order-2 flex justify-center items-center min-h-[300px] md:min-h-[400px]">
                                {/*
                                    *** ILLUSTRATION PLACEHOLDER ***
                                    Description: Create an illustration that blends Ethiopian culture/identity with modern, accessible technology in an educational context.
                                    Ideas:
                                    - Show diverse Ethiopian students (modern clothing, maybe subtle traditional patterns) engaging happily with laptops/tablets displaying Lumo's interface (simulations, graphs).
                                    - Include subtle background elements like a stylized map outline of Ethiopia, the Meskel flower motif, or geometric patterns inspired by Ethiopian art.
                                    - Visually represent "accessibility": Perhaps show Lumo running smoothly on both newer and slightly older-looking computer models.
                                    - Use a bright, optimistic color palette incorporating blues, greens, yellows, and perhaps hints of red.
                                    - Style: Clean, modern vector illustration, perhaps with subtle textures. Avoid stereotypes. Focus on empowerment and progress.
                                    - Replace this div with your <img /> or <Image /> component once ready. Optimize the image (WebP/AVIF, correct size).
                                */}
                                <img src='/EthiopianStudents.jpg' alt="Illustration focused on Ethiopian students and technology" width={500} height={450} className="max-w-md rounded-lg shadow-lg"></img>
                            </motion.div>
                        </div>
                    </ThemedSection>

                    {/* Section 3: Features */}
                    <ThemedSection id="features" background="graph" className="py-16 md:py-24 bg-white dark:bg-slate-950/90">
                        <SectionHeading text="Lumo's Core Toolkit" level="h2" align="center" className="mb-12 md:mb-16 text-3xl md:text-4xl" delay={1}/>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                            {features.map((feature, index) => (
                                // FeatureCards use InfoCard, which uses fadeIn variant staggered by staggerContainer
                                <FeatureCard key={index} {...feature} custom={index + 1} />
                            ))}
                        </div>
                    </ThemedSection>

                    {/* Section 4: How it Works */}
                    <ThemedSection id="how-it-works" background="subtle-noise" className="py-16 md:py-24">
                        <SectionHeading text="Getting Started is Simple" level="h2" align="center" className="mb-12 md:mb-16 text-3xl md:text-4xl" delay={1} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto text-center">
                            {/* These divs use fadeIn variant staggered by staggerContainer */}
                            <motion.div variants={fadeIn} custom={1}>
                                <div className="mb-3 text-5xl font-bold text-blue-500 dark:text-blue-400 font-heading">1</div>
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Explore</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Access via web or school PC. Dive into interactive lessons, simulations & quizzes.</p>
                            </motion.div>
                            <motion.div variants={fadeIn} custom={2}>
                                <div className="mb-3 text-5xl font-bold text-purple-500 dark:text-purple-400 font-heading">2</div>
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Learn</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Use AI help, focus tools, create content, and see your knowledge grow.</p>
                            </motion.div>
                            <motion.div variants={fadeIn} custom={3}>
                                <div className="mb-3 text-5xl font-bold text-green-500 dark:text-green-400 font-heading">3</div>
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Achieve</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Track progress with clear reports and reach your academic goals confidently.</p>
                            </motion.div>
                        </div>
                    </ThemedSection>

                    {/* Section 5: CTA */}
                    <ThemedSection id="cta" background="dots" className="py-20 md:py-28 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800/70 dark:to-slate-900">
                        <div className="text-center max-w-3xl mx-auto">
                            <SectionHeading
                                text="Ready to Transform Learning?"
                                level="h2"
                                align="center"
                                className="mb-4 text-3xl md:text-4xl lg:text-5xl"
                                delay={1}
                            />
                            <motion.p variants={fadeIn} custom={1.5} className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                                Join early access as a student or explore partnership opportunities for your school. Let's build a brighter future for Ethiopian education together.
                            </motion.p>
                            <motion.div variants={fadeIn} custom={2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {/* Enhanced CTA Button */}
                                <motion.div
                                    whileHover={buttonGlowHover}
                                    whileTap={buttonGlowTap}
                                    className="relative group w-full sm:w-auto"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                                    <Button onClick={handleEarlyAccess} size="lg" className="relative w-full sm:w-auto text-lg px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 dark:text-gray-950 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-400 dark:hover:to-purple-400 rounded-lg shadow-lg transition-all duration-300">
                                        Sign Up for Early Access <MoveRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={partnershipsHoverEffect} whileTap={partnershipsTapEffect} className="w-full sm:w-auto">
                                    <Button onClick={handleContact} size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-3 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:border-slate-500 dark:hover:border-slate-500 transition-colors duration-200">
                                        <Users className="mr-2 h-5 w-5" /> Explore Partnerships
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </ThemedSection>


                    {/* Section 6: Contact */}
                    <ThemedSection id="contact" background="subtle-noise" className="py-16 md:py-24 border-t border-gray-200 dark:border-slate-700/50">
                        <SectionHeading text="Get In Touch" level="h2" align="center" className="mb-10 md:mb-12 text-3xl md:text-4xl" delay={1}/>
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-16">
                            {/* These divs use fadeIn variant staggered by staggerContainer */}
                            <motion.div variants={fadeIn} custom={1} className="md:col-span-2">
                                <h3 className="font-semibold text-xl mb-4 text-slate-800 dark:text-slate-100">Contact Information</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">Have questions or interested in partnering? We'd love to hear from you.</p>
                                <div className="space-y-3 text-sm">
                                    <a href="tel:+251911376145" className="flex items-center group text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <Phone className="w-4 h-4 mr-2.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                                        <span>+251 911 37 61 45</span>
                                    </a>
                                    <a href="tel:+251915949551" className="flex items-center group text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <Phone className="w-4 h-4 mr-2.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                                        <span>+251 915 94 95 51</span>
                                    </a>
                                    <a href="mailto:info@ascii-technologies.com" className="flex items-center group text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                        <Mail className="w-4 h-4 mr-2.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                                        <span>info@ascii-technologies.com</span>
                                    </a>
                                </div>
                            </motion.div>
                            {/* NOTE: For actual loading indicators (point 6), you'd add state to the form submission logic. */}
                            {/* Example: const [isSubmitting, setIsSubmitting] = useState(false); */}
                            {/* On submit: setIsSubmitting(true); ... then handle submission ... setIsSubmitting(false); */}
                            {/* Button would then show indicator: <Button disabled={isSubmitting}>{isSubmitting ? <LoadingSpinner /> : 'Send Message'}</Button> */}
                            {/* Consider sci-fi loaders like particle streams or data packet animations. */}
                            <motion.form variants={fadeIn} custom={1.5} className="space-y-4 md:col-span-3">
                                <h3 className="font-semibold text-xl mb-4 text-slate-800 dark:text-slate-100">Send us a Message</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input type="text" required placeholder="Your Name" className="bg-white dark:bg-slate-800/90 border-gray-300 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500" />
                                    <Input type="email" required placeholder="Your Email" className="bg-white dark:bg-slate-800/90 border-gray-300 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500" />
                                </div>
                                <textarea required placeholder="Your Message" rows={4} className="w-full bg-white dark:bg-slate-800/90 border-gray-300 dark:border-slate-700 rounded-md p-2 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500" />
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-colors">Send Message</Button>
                            </motion.form>
                        </div>
                    </ThemedSection>

                </motion.div> {/* End Content Wrapper */}
            </main>

            {/* --- Footer --- */}
            <footer className="w-full py-6 border-t border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 text-sm">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-slate-500 dark:text-slate-400">
                    <p>© {new Date().getFullYear()} ASCII Technologies (Lumo). All rights reserved.</p>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
                        <Link href="#contact" onClick={handleContact} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>

            {/* --- Global Styles & Notes --- */}
            <style jsx global>{`
                /* Font Imports (Assumed done elsewhere) */
                body {
                    font-family: 'Inter', system-ui, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                .font-heading { font-family: 'Poppins', sans-serif; }
                .font-chalk { font-family: 'Permanent Marker', cursive; }

                /* Subtle Background Patterns (Keep existing) */
                .bg-graph-subtle { /* ... */ }
                .dark .bg-graph-subtle { /* ... */ }
                .bg-lined-subtle { /* ... */ }
                .dark .bg-lined-subtle { /* ... */ }
                .bg-dots-subtle { /* ... */ }
                .dark .bg-dots-subtle { /* ... */ }
                .bg-noise-subtle { /* ... */ }

                /* Tilt Animation (Keep existing) */
                @keyframes tilt { 0%, 50%, 100% { transform: rotate(0deg); } 25% { transform: rotate(0.5deg); } 75% { transform: rotate(-0.5deg); } }
                .animate-tilt { animation: tilt 7s infinite linear; }

                /* Focus Ring (Keep existing) */
                *:focus-visible { outline: 2px solid theme('colors.blue.500'); outline-offset: 2px; border-radius: 4px; }

                /* Performance Note:
                   - Ensure images are optimized (WebP/AVIF, correct dimensions). Use Next.js <Image> component for automatic optimization.
                   - Consider dynamic imports 'next/dynamic' for heavy components below the fold or non-essential JS libraries.
                   - Profile bundle size (next build --profile && analyze) to identify large dependencies.
                   - Leverage Next.js Server Components where possible to reduce client-side JS.
                */

                /* Cross-Browser Note:
                   - Tailwind CSS handles most vendor prefixes automatically.
                   - Test thoroughly on target browsers (Chrome, Firefox, Safari, Edge).
                   - For complex animations or CSS features, check caniuse.com and provide fallbacks if needed for older browser support.
                */

                 /* Particle Effects Note:
                   - For advanced particle effects on buttons (on hover/click), consider JS libraries like 'tsparticles' or 'particles.js'.
                   - Alternatively, use CSS pseudo-elements (::before, ::after) with keyframe animations for simpler effects (e.g., small expanding/fading circles). This avoids extra JS bundles.
                */

                 /* Loading Indicator Note:
                    - Implement loading states (e.g., useState) for async actions like form submits.
                    - Replace standard spinners with more thematic SVG animations (data streams, particle bursts, teleport effects) tied to the loading state.
                 */
            `}</style>
        </div>
    );
}