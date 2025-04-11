/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useEffect, useRef, useState } from "react"; // Added useState
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    GraduationCap, Rocket, MoveRight, Menu, Sun, Moon, X, // Added X for close icon
    Beaker, BrainCircuit, Brush, AreaChart, Clock, BookOpenCheck, Users, Target, Phone, Mail,
    Zap, // Relevant icons
    ChevronDown // Added for scroll indicator
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useScroll, useTransform, Variants, TargetAndTransition, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import Link from 'next/link';
import dynamic from 'next/dynamic'; // Import dynamic for potential code splitting
import Image from 'next/image'; // For optimized images

// --- Theme Toggle Component ---
import { ThemeToggle } from "@/components/theme-toggle"; // Assuming this exists

// --- Fonts ---
// Assumed done in layout.tsx or globals.css

// --- Animation Variants (Refined) ---
const fadeIn: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
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
            delayChildren: 0.1,
        },
    },
};

// Button Hover Effects
const buttonGlowHover: TargetAndTransition = {
    scale: 1.05,
    filter: 'brightness(1.2) drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))',
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
    // Responsive text alignment: default to left, use md: for larger screens if needed
    const alignClass = `text-${align}`;
    const mdAlignClass = `md:text-${align}`; // Keep original alignment for medium+ screens if specified

    return (
        <motion.div
            variants={scaleFadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            custom={delay}
        >
            {/* Default to center align on mobile for headings if align='center' */}
            <Tag className={`font-semibold tracking-tight text-slate-900 dark:text-white ${fontClass} ${align === 'center' ? 'text-center' : `text-${align}`} ${mdAlignClass} ${className}`}>
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
            // Adjust padding slightly for mobile
            className={`w-full py-12 md:py-20 lg:py-24 relative overflow-hidden ${bgClass} ${className}`}
        >
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
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
            className={`p-6 rounded-xl border bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700/80 shadow-lg dark:shadow-slate-900/50 backdrop-blur-md h-full ${className}`}
            variants={variants}
            custom={custom}
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
    const cardHoverEffect: TargetAndTransition = {
        y: -6,
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.5)",
    };

    return (
        <InfoCard
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

// --- Mobile Navigation Component ---
interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    onSignIn: () => void;
    onEarlyAccess: () => void;
    onContact: () => void;
    session: any; // Pass session data
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onSignIn, onEarlyAccess, onContact, session }) => {
    const menuVariants: Variants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
        exit: { opacity: 0, y: -30, transition: { duration: 0.2 } }
    };

    const handleLinkClick = (action: () => void) => {
        action();
        onClose(); // Close menu when a link is clicked
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full left-0 right-0 z-50 md:hidden bg-white dark:bg-slate-800 shadow-lg border-t border-gray-200 dark:border-slate-700/60 p-4"
                >
                    <nav className="flex flex-col space-y-3">
                        <Button variant="ghost" size="sm" onClick={() => handleLinkClick(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }))} className="justify-start text-slate-600 dark:text-slate-300">Features</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleLinkClick(onContact)} className="justify-start text-slate-600 dark:text-slate-300">Contact</Button>
                        <hr className="border-gray-200 dark:border-slate-700/60" />
                        {!session && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                                <Button onClick={() => handleLinkClick(onSignIn)} size="sm" variant="outline" className="w-full justify-center text-blue-600 border-blue-500/60 hover:bg-blue-50/70 hover:border-blue-500 dark:text-blue-400 dark:border-blue-400/60 dark:hover:bg-blue-900/30 dark:hover:border-blue-400/80 font-medium px-4">
                                    Sign In
                                </Button>
                             </motion.div>
                        )}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <Button onClick={() => handleLinkClick(onEarlyAccess)} size="sm" className="w-full justify-center font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 dark:text-gray-950 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-400 dark:hover:to-purple-400 rounded-md shadow-md transition-all duration-300">
                                Get Early Access
                            </Button>
                        </motion.div>
                        <div className="pt-2">
                            <ThemeToggle />
                        </div>
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- Main Landing Page Component ---
export default function LandingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const heroRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

    // --- Smoother Reveal Transition ---
    const { scrollYProgress: contentRevealProgress } = useScroll({
        target: contentWrapperRef,
        offset: ["start end", "start 0.7"]
    });
    const contentOpacity = useTransform(contentRevealProgress, [0, 0.5], [0, 1]);
    const contentY = useTransform(contentRevealProgress, [0, 0.8], ["30px", "0px"]);
    const contentScale = useTransform(contentRevealProgress, [0, 1], [0.98, 1]);

    useEffect(() => {
        // Theme setup (keep as is)
        const savedTheme = localStorage.getItem('lumo-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) { document.documentElement.classList.add('dark'); }
        else { document.documentElement.classList.remove('dark'); }
    }, []);

    // --- Handlers ---
    const handleSignIn = () => router.push("/auth/signin");
    const handleEarlyAccess = () => router.push("/auth/signup");
    const handleContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    const handleScrollDown = () => contentWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
    const partnershipsHoverEffect: TargetAndTransition = { y: -2, scale: 1.03, filter: 'brightness(1.05)' };
    const partnershipsTapEffect: TargetAndTransition = { scale: 0.98 };

    return (
        <div className="bg-gray-50 dark:bg-slate-950 min-h-screen flex flex-col overflow-x-hidden antialiased">

            {/* --- Header --- */}
            <motion.header
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                // Relative positioning needed for absolute positioned mobile menu
                className="sticky top-0 z-40 w-full h-16 flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-700/60 shadow-sm"
            >
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="ml-2 text-xl font-semibold font-heading text-slate-900 dark:text-slate-100">Lumo</span>
                    </Link>
                    {/* Desktop Navigation */}
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
                        <motion.div
                            whileHover={buttonGlowHover}
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
                     {/* Mobile Navigation Toggle */}
                    <div className="md:hidden flex items-center space-x-1">
                         {/* Theme toggle visible outside mobile menu */}
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
                 {/* Mobile Menu Drawer */}
                 <MobileNav
                    isOpen={isMobileMenuOpen}
                    onClose={toggleMobileMenu} // Pass the toggle function to close
                    onSignIn={handleSignIn}
                    onEarlyAccess={handleEarlyAccess}
                    onContact={handleContact}
                    session={session}
                />
            </motion.header>

            {/* --- Main Content --- */}
            <main className="flex-1">
                {/* Section 1: Hero */}
                <section
                    ref={heroRef}
                    // Adjusted min-height for better mobile view, reduced max-height slightly
                    className="h-[calc(100vh-4rem)] min-h-[550px] sm:min-h-[600px] max-h-[850px] w-full flex flex-col items-center justify-center z-10 bg-gradient-to-br from-slate-800 via-slate-900 to-black dark:from-slate-950 dark:via-black dark:to-black text-slate-100 overflow-hidden border-b-4 border-gray-400 dark:border-slate-700 relative" // Added relative positioning
                >
                    <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                        <SectionHeading
                            level="h1"
                            text="Transforming Education in Ethiopia"
                            // Slightly smaller base text size for mobile
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 !text-slate-100 drop-shadow-lg"
                            useChalkFont={true}
                            align="center"
                            delay={0}
                        />
                        <motion.p
                            variants={fadeIn} initial="hidden" animate="visible" custom={1}
                            // Adjust text size for mobile
                            className="font-sans text-base sm:text-lg md:text-xl text-slate-300 dark:text-gray-300 max-w-3xl mx-auto mt-2 mb-8"
                        >
                            Interactive, accessible learning tools designed for students & schools. Tackling low exam pass rates with modern solutions.
                        </motion.p>
                        <motion.div
                            variants={fadeIn} initial="hidden" animate="visible" custom={2}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <motion.div
                                whileHover={buttonGlowHover}
                                whileTap={buttonGlowTap}
                                className="relative group w-full sm:w-auto" // Full width on mobile
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                                <Button onClick={handleEarlyAccess} size="lg" className="relative w-full text-lg px-6 sm:px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 dark:text-gray-950 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-400 dark:hover:to-purple-400 rounded-lg shadow-lg transition-all duration-300">
                                    Get Early Access
                                    <Rocket className="ml-2.5 h-5 w-5 group-hover:translate-x-1 transition-transform inline-block" /> {/* Ensure icon is inline */}
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                    {/* Scroll Down Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0] }}
                        transition={{ delay: 2.5, duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-20"
                        onClick={handleScrollDown}
                        title="Scroll down"
                    >
                        <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 hover:text-slate-200 transition-colors" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent dark:from-black/40 pointer-events-none"></div>
                </section>


                {/* --- Content Wrapper for Reveal --- */}
                <motion.div
                    ref={contentWrapperRef}
                    className="relative z-20 bg-gray-50 dark:bg-slate-900 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.4)]"
                    style={{
                        opacity: contentOpacity,
                        y: contentY,
                        scale: contentScale
                    }}
                >
                    {/* Section 2: Ethiopia Focus */}
                    <ThemedSection id="ethiopia-focus" background="subtle-noise" className="pt-16 md:pt-20 pb-12 md:pb-24">
                        {/* Grid stacks vertically by default */}
                        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
                            <div className="order-2 md:order-1">
                                <SectionHeading
                                    text="Tailored for Ethiopia's Success"
                                    level="h2"
                                    // Adjust heading size for mobile
                                    className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-5"
                                    delay={1}
                                    align="left" // Keep left aligned
                                />
                                <motion.p variants={fadeIn} custom={1.5} className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6">
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

                            {/* Image Section */}
                            <motion.div variants={fadeIn} custom={1.5} className="order-1 md:order-2 flex justify-center items-center min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                                {/* --- IMAGE FIX --- */}
                                {/* 1. Ensure 'ethio.png' (or your image file) is in the 'public' folder */}
                                {/* 2. Use the correct path starting with '/' */}
                                {/* 3. Provide width and height for layout stability and optimization */}
                                <Image
                                    src="/ethio.png" //  <--- MAKE SURE ethio.png IS IN YOUR /public FOLDER
                                    alt="Illustration focused on Ethiopian students and technology in a classroom setting"
                                    width={500} // Specify the intrinsic width of your image
                                    height={450} // Specify the intrinsic height of your image
                                    className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg object-contain" // Use max-w and object-contain for responsiveness
                                    priority // Add priority if this image is often visible above the fold
                                />
                            </motion.div>
                        </div>
                    </ThemedSection>

                    {/* Section 3: Features */}
                    <ThemedSection id="features" background="graph" className="py-16 md:py-24 bg-white dark:bg-slate-950/90">
                        <SectionHeading
                             text="Lumo's Core Toolkit"
                             level="h2"
                             align="center"
                             className="mb-10 md:mb-16 text-2xl sm:text-3xl md:text-4xl" // Responsive heading size
                             delay={1}
                         />
                        {/* Grid stacks automatically: 1 col -> sm: 2 cols -> lg: 3 cols */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} custom={index + 1} />
                            ))}
                        </div>
                    </ThemedSection>

                    {/* Section 4: How it Works */}
                    <ThemedSection id="how-it-works" background="subtle-noise" className="py-16 md:py-24">
                        <SectionHeading
                            text="Getting Started is Simple"
                            level="h2"
                            align="center"
                            className="mb-10 md:mb-16 text-2xl sm:text-3xl md:text-4xl" // Responsive heading size
                            delay={1}
                        />
                        {/* Grid stacks automatically: 1 col -> md: 3 cols */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto text-center">
                            <motion.div variants={fadeIn} custom={1}>
                                <div className="mb-3 text-5xl font-bold text-blue-500 dark:text-blue-400 font-heading">1</div>
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Explore</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm px-2 sm:px-0">Access via web or school PC. Dive into interactive lessons, simulations & quizzes.</p> {/* Added padding for narrow screens */}
                            </motion.div>
                            <motion.div variants={fadeIn} custom={2}>
                                <div className="mb-3 text-5xl font-bold text-purple-500 dark:text-purple-400 font-heading">2</div>
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Learn</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm px-2 sm:px-0">Use AI help, focus tools, create content, and see your knowledge grow.</p>
                            </motion.div>
                            <motion.div variants={fadeIn} custom={3}>
                                <div className="mb-3 text-5xl font-bold text-green-500 dark:text-green-400 font-heading">3</div>
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Achieve</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm px-2 sm:px-0">Track progress with clear reports and reach your academic goals confidently.</p>
                            </motion.div>
                        </div>
                    </ThemedSection>

                    {/* Section 5: CTA */}
                    <ThemedSection id="cta" background="dots" className="py-16 md:py-28 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800/70 dark:to-slate-900">
                        <div className="text-center max-w-3xl mx-auto">
                            <SectionHeading
                                text="Ready to Transform Learning?"
                                level="h2"
                                align="center"
                                className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" // Responsive heading size
                                delay={1}
                            />
                            <motion.p variants={fadeIn} custom={1.5} className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8">
                                Join early access as a student or explore partnership opportunities for your school. Let's build a brighter future for Ethiopian education together.
                            </motion.p>
                            {/* Flex column on mobile, row on small screens and up */}
                            <motion.div variants={fadeIn} custom={2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <motion.div
                                    whileHover={buttonGlowHover}
                                    whileTap={buttonGlowTap}
                                    className="relative group w-full sm:w-auto" // Full width on mobile
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                                    <Button onClick={handleEarlyAccess} size="lg" className="relative w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 dark:text-gray-950 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-400 dark:hover:to-purple-400 rounded-lg shadow-lg transition-all duration-300">
                                        Sign Up for Early Access <MoveRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform inline-block" />
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={partnershipsHoverEffect} whileTap={partnershipsTapEffect} className="w-full sm:w-auto">
                                    <Button onClick={handleContact} size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:border-slate-500 dark:hover:border-slate-500 transition-colors duration-200">
                                        <Users className="mr-2 h-5 w-5 inline-block" /> Explore Partnerships
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </ThemedSection>


                    {/* Section 6: Contact */}
                    <ThemedSection id="contact" background="subtle-noise" className="py-16 md:py-24 border-t border-gray-200 dark:border-slate-700/50">
                        <SectionHeading
                            text="Get In Touch"
                            level="h2"
                            align="center"
                            className="mb-10 md:mb-12 text-2xl sm:text-3xl md:text-4xl" // Responsive heading size
                            delay={1}
                        />
                         {/* Grid stacks automatically: 1 col -> md: 5 cols */}
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-16">
                            <motion.div variants={fadeIn} custom={1} className="md:col-span-2">
                                <h3 className="font-semibold text-xl mb-4 text-slate-800 dark:text-slate-100">Contact Information</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm sm:text-base">Have questions or interested in partnering? We'd love to hear from you.</p>
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
                            <motion.form variants={fadeIn} custom={1.5} className="space-y-4 md:col-span-3">
                                <h3 className="font-semibold text-xl mb-4 text-slate-800 dark:text-slate-100">Send us a Message</h3>
                                {/* Grid stacks automatically: 1 col -> sm: 2 cols */}
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
                {/* Flex column on mobile, row on medium screens and up */}
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-slate-500 dark:text-slate-400">
                    <p className="mb-2 md:mb-0">© {new Date().getFullYear()} ASCII Technologies (Lumo). All rights reserved.</p>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
                        <Link href="#contact" onClick={handleContact} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>

            {/* --- Global Styles & Notes --- */}
            <style jsx global>{`
                /* Font Imports (Keep existing) */
                body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
                .font-heading { font-family: 'Poppins', sans-serif; }
                .font-chalk { font-family: 'Permanent Marker', cursive; }

                /* Subtle Background Patterns (Keep existing) */
                 .bg-graph-subtle { background-image: linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(to right, rgba(59, 130, 246, 0.08) 1px, transparent 1px); background-size: 20px 20px; }
                .dark .bg-graph-subtle { background-image: linear-gradient(rgba(96, 165, 250, 0.1) 1px, transparent 1px), linear-gradient(to right, rgba(96, 165, 250, 0.1) 1px, transparent 1px); }
                .bg-lined-subtle { background-image: repeating-linear-gradient(theme("colors.gray.200 / 0.7") 0 1px, transparent 1px 100%); background-size: 100% 2em; }
                .dark .bg-lined-subtle { background-image: repeating-linear-gradient(theme("colors.slate.700 / 0.5") 0 1px, transparent 1px 100%); }
                .bg-dots-subtle { background-image: radial-gradient(theme("colors.purple.200 / 0.6") 1px, transparent 1px); background-size: 16px 16px; }
                .dark .bg-dots-subtle { background-image: radial-gradient(theme("colors.purple.800 / 0.4") 1px, transparent 1px); }
                .bg-noise-subtle { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23D1D5DB' stroke-width='1'%3E%3Cpath d='M0 0h800v800H0z'/%3E%3Cpath d='M0 400h800M400 0v800'/%3E%3C/g%3E%3C/svg%3E"); background-size: 800px 800px; /* More subtle noise example */ }

                /* Tilt Animation (Keep existing) */
                @keyframes tilt { 0%, 50%, 100% { transform: rotate(0deg); } 25% { transform: rotate(0.5deg); } 75% { transform: rotate(-0.5deg); } }
                .animate-tilt { animation: tilt 7s infinite linear; }

                /* Focus Ring (Keep existing) */
                *:focus-visible { outline: 2px solid theme('colors.blue.500'); outline-offset: 2px; border-radius: 4px; }

                /* Ensure body takes full height for footer placement */
                html, body, #__next { height: 100%; }
                #__next > div { /* Targeting the main div wrapper */
                    display: flex;
                    flex-direction: column;
                    min-height: 100%;
                }
                main { flex-grow: 1; }

                /* Add other notes as before */
            `}</style>
        </div>
    );
}