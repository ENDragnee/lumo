"use client"

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Keep Label for form accessibility
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
    GraduationCap, Lightbulb, Zap, Rocket, MoveRight, ChevronRight, Menu, Sun, Moon, // ChevronRight for buttons
    PenSquare, DraftingCompass, BrainCircuit, Computer, ShieldCheck, Feather, School, Building,
    Video, AudioWaveform, Puzzle, ListChecks, Users, BarChart, Bot, BookOpen, Target, // Target for Focus Tools
    Mail, Phone, Linkedin, Github, Layers // Layers for Accessible Tech
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useScroll, useTransform } from "framer-motion";

// --- Animation Variants (Keep as is or adjust timings) ---
const fadeIn = (direction = 'up', delay = 0, duration = 0.5) => ({ /* ... */ });
const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({ /* ... */ });
// --- (End Animation Variants) ---


// --- New Scroll-Linked Visual Component ---
function ScrollVisualStory() {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"] // Track scroll progress across the entire target container
    });

    // Example: Animate the length of an SVG path
    // Adjust the 'd' attribute to create a path that visually spans your page height
    // The path starts off-screen top-left-ish and curves/moves down towards bottom-right-ish
    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const pathDraw = useTransform(scrollYProgress, value => `path(${value * 100}%)`); // Example - may need different transform

    return (
        <motion.div
            ref={targetRef}
            className="fixed inset-0 z-0 pointer-events-none" // Position behind content, ignore pointer
            // style={{ clipPath: pathDraw }} // Example usage of clip-path
        >
            {/* Option 1: SVG Path Animation */}
             <svg width="100%" height="100%" viewBox="0 0 50 1000" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full">
                 <motion.path
                    d="M 10 0 Q 40 250, 10 500 T 40 1000" // Example simple S-curve path - NEEDS ADJUSTMENT FOR YOUR LAYOUT
                    fill="none"
                    stroke="url(#line-gradient)" // Apply gradient stroke
                    strokeWidth="1.5" // Thinner line
                    strokeLinecap="round"
                    style={{ pathLength: pathLength }} // Animate path drawing
                 />
                 {/* Define the gradient for the stroke */}
                 <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" /> {/* Indigo */}
                        <stop offset="50%" stopColor="#8B5CF6" /> {/* Purple */}
                        <stop offset="100%" stopColor="#EC4899" /> {/* Pink */}
                    </linearGradient>
                 </defs>
            </svg>

            {/* Option 2: Animated Gradient Blob (more complex) */}
            {/* <motion.div className="absolute ... bg-gradient-radial ... " style={{ opacity: scrollYProgress, scale: ... }} /> */}
        </motion.div>
    );
}


export default function LandingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isMobile, setIsMobile] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        // Set default theme to dark
        document.documentElement.classList.add('dark');
        // Basic mobile check
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Contact Form Submitted:", formData);
        alert("Message sent! (Logged to console)");
        setFormData({ name: '', email: '', message: '' });
    };

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    // Define common button style based on PDF
    const primaryButtonStyle = "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-5 rounded-md inline-flex items-center gap-1.5 transition duration-200 ease-in-out";
    const secondaryButtonStyle = "border border-purple-500/50 hover:border-purple-500/80 hover:bg-purple-500/10 text-purple-300 font-semibold py-2 px-5 rounded-md inline-flex items-center gap-1.5 transition duration-200 ease-in-out";


    return (
        // Removed dark theme toggling logic, forcing dark mode
        <div className="dark"> {/* Force dark mode */}
             {/* Persistent Background */}
            <div className="fixed inset-0 -z-10 h-full w-full from-[#0a0f1f] to-[#0f172a] bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70"></div> {/* Dark gradient + subtle grid */}

            {/* Scroll Visual Element */}
            <ScrollVisualStory />

            <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden text-gray-200 font-sans"> {/* Base text color, font family */}

                {/* --- Header --- */}
                <header className="sticky top-0 z-50 w-full px-4 lg:px-8 h-16 flex items-center justify-center bg-[#0a0f1f]/80 backdrop-blur-md border-b border-slate-700/50">
                    <div className="flex items-center justify-between w-full max-w-7xl">
                        {/* Logo */}
                        <a className="flex items-center group" href="#">
                             <GraduationCap className="h-6 w-6 text-blue-400" /> {/* Adjusted icon color */}
                             <span className="ml-2 text-xl font-bold tracking-tight text-white">Lumo</span>
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-3">
                            <Button variant="link" size="sm" onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white text-sm">Features</Button>
                            <Button variant="link" size="sm" onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white text-sm">Contact</Button>
                            <Button variant="ghost" size="sm" onClick={() => router.push('/auth/signin')} className="text-gray-300 hover:text-white hover:bg-slate-700/50 text-sm px-3 py-1.5 rounded-md">Sign In</Button>
                            <Button onClick={() => router.push('/auth/signup')} className={`${primaryButtonStyle} text-sm px-4 py-1.5`}>
                                Get Early Access <ChevronRight className="h-4 w-4" />
                            </Button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-slate-700/50">
                                <Menu className="h-6 w-6" /> {/* TODO: Implement mobile menu */}
                            </Button>
                        </div>
                    </div>
                </header>

                {/* --- Main Content --- */}
                <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-6xl"> {/* Adjusted max-width slightly */}

                        {/* --- 1. Hero Section --- */}
                        <section
                            id="hero"
                            className="w-full py-28 md:py-36 lg:py-48 flex flex-col items-center text-center"
                        >
                           <motion.h1
                                variants={fadeIn('down', 0, 0.6)} initial="hidden" whileInView="show" viewport={{ once: true }}
                                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/tight text-white mb-4"
                            >
                                Transforming Education in Ethiopia
                            </motion.h1>
                            <motion.p
                                variants={fadeIn('down', 0.2, 0.6)} initial="hidden" whileInView="show" viewport={{ once: true }}
                                className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl mb-8"
                            >
                                Interactive, accessible learning tools designed for students & schools. Tackling low exam pass rates with modern solutions.
                            </motion.p>
                            <motion.div
                                variants={fadeIn('up', 0.4, 0.6)} initial="hidden" whileInView="show" viewport={{ once: true }}
                            >
                                <Button onClick={() => router.push('/auth/signup')} className={`${primaryButtonStyle} text-base px-6 py-2.5`}>
                                    Get Early Access <ChevronRight className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        </section>

                        {/* --- 2. Tailored for Ethiopia's Success --- */}
                        <section id="tailored" className="w-full py-20 md:py-28 lg:py-32 bg-slate-900/40 rounded-xl my-16 backdrop-blur-sm">
                            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto px-6 lg:px-8">
                                <motion.div variants={fadeIn('right', 0.1, 0.6)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white mb-4">
                                        Tailored for Ethiopia's Success
                                    </h2>
                                    <p className="text-gray-300 text-lg mb-6">
                                        Lumo directly addresses the educational hurdles Ethiopian students face, especially concerning Grade 12 national exam success rates. We aim to unlock potential and open doors to future opportunities.
                                    </p>
                                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/20 border border-slate-700/60 rounded-lg p-4 flex items-start gap-3">
                                        <div className="mt-1">
                                            <Layers className="h-6 w-6 text-blue-400 flex-shrink-0" /> {/* Using Layers for 'OS' feel */}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Accessible Technology</h4>
                                            <p className="text-sm text-gray-400 leading-normal">
                                                Designed to run efficiently on standard school computers via a lightweight OS, making modern learning feasible even with limited resources.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div variants={fadeIn('left', 0.1, 0.6)} initial="hidden" whileInView="show" viewport={{ once: true }} className="aspect-video bg-slate-700 rounded-lg shadow-lg flex items-center justify-center">
                                    {/* Replace with actual image */}
                                    <img src="/placeholder-students.jpg" alt="Ethiopian students using computers" className="object-cover w-full h-full rounded-lg"/>
                                    {/* <span className="text-gray-400 text-sm">[Placeholder: Image of Students]</span> */}
                                </motion.div>
                            </div>
                        </section>


                        {/* --- 3. Lumo's Core Toolkit --- */}
                        <section id="features" className="w-full py-20 md:py-28 lg:py-32">
                            <motion.h2
                                variants={fadeIn('down', 0, 0.5)} initial="hidden" whileInView="show" viewport={{ once: true }}
                                className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-12 md:mb-16 text-white"
                            >
                                Lumo's Core Toolkit
                            </motion.h2>
                            <motion.div
                                variants={staggerContainer(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" // Reduced gap
                            >
                                {/* Feature Card Component (Example - Repeat for others) */}
                                <FeatureCard
                                    icon={Puzzle} // Replace with appropriate icons
                                    title="Interactive Simulations"
                                    description="Bring concepts like Chemistry & Physics to life with hands-on virtual experiments."
                                    delay={0}
                                />
                                <FeatureCard
                                    icon={Bot}
                                    title="AI Tutor"
                                    description="Get personalized explanations and 24/7 guidance adapting to your learning style."
                                    delay={0.1}
                                />
                                <FeatureCard
                                    icon={PenSquare}
                                    title="Creator Studio"
                                    description="Build custom lessons with text, video, quizzes, and more. For educators & students."
                                    delay={0.2}
                                />
                                <FeatureCard
                                    icon={BarChart}
                                    title="Progress Tracking"
                                    description="Monitor your learning journey with detailed metrics and visual reports."
                                    delay={0.05} // Adjust delays for second row if needed
                                />
                                <FeatureCard
                                    icon={Target} // Using Target for Focus Tools
                                    title="Focus Tools"
                                    description="Build effective study habits using techniques like the Pomodoro timer."
                                    delay={0.15}
                                />
                                <FeatureCard
                                    icon={BookOpen} // Using BookOpen for Rich Content
                                    title="Rich Content"
                                    description="Learn through visuals, audio, and interactions catering to diverse learning styles."
                                    delay={0.25}
                                />
                                 {/* Add the duplicate row from PDF if desired */}
                                {/* <FeatureCard icon={BarChart} title="Progress Tracking" description="..." delay={0.3}/>
                                <FeatureCard icon={Target} title="Focus Tools" description="..." delay={0.35}/>
                                <FeatureCard icon={BookOpen} title="Rich Content" description="..." delay={0.4}/> */}
                            </motion.div>
                        </section>

                         {/* --- 4. Getting Started is Simple --- */}
                        <section id="getting-started" className="w-full py-20 md:py-28 lg:py-32">
                             <motion.h2
                                variants={fadeIn('down', 0, 0.5)} initial="hidden" whileInView="show" viewport={{ once: true }}
                                className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-12 md:mb-16 text-white"
                            >
                                Getting Started is Simple
                            </motion.h2>
                            <motion.div
                                variants={staggerContainer(0.15)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12"
                            >
                                <StepCard number="1" title="Explore" description="Access via web or school PC. Dive into interactive lessons, simulations & quizzes." delay={0} />
                                <StepCard number="2" title="Learn" description="Use AI help, focus tools, create content, and see your knowledge grow." delay={0.1} />
                                <StepCard number="3" title="Achieve" description="Track progress with clear reports and reach your academic goals confidently." delay={0.2} />
                            </motion.div>
                            <motion.div
                                variants={fadeIn('up', 0.3, 0.6)} initial="hidden" whileInView="show" viewport={{ once: true }}
                                className="flex flex-col sm:flex-row justify-center items-center gap-4"
                            >
                                <Button onClick={() => router.push('/signup')} className={`${primaryButtonStyle} text-base px-6 py-2.5 w-full sm:w-auto`}>
                                    Sign Up for Early Access <ChevronRight className="h-5 w-5" />
                                </Button>
                                <Button onClick={() => scrollToSection('contact')} className={`${secondaryButtonStyle} text-base px-6 py-2.5 w-full sm:w-auto`}>
                                     <Users className="h-5 w-5 mr-1"/> Explore Partnerships
                                </Button>
                            </motion.div>
                        </section>


                        {/* --- 5. Get In Touch --- */}
                        <section id="contact" className="w-full py-20 md:py-28 lg:py-32 bg-slate-900/40 rounded-xl my-16 backdrop-blur-sm">
                            <motion.h2
                                variants={fadeIn('down', 0, 0.5)} initial="hidden" whileInView="show" viewport={{ once: true }}
                                className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-10 md:mb-12 text-white"
                            >
                                Get In Touch
                            </motion.h2>
                            <motion.div
                                variants={staggerContainer(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
                                className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto px-6 lg:px-8"
                            >
                                {/* Contact Info */}
                                <motion.div variants={fadeIn('right', 0.1, 0.6)}>
                                    <h3 className="text-xl font-semibold text-white mb-3">Contact Information</h3>
                                    <p className="text-gray-300 mb-6">
                                        Have questions or interested in partnering? We'd love to hear from you.
                                    </p>
                                    <div className="space-y-2 text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-blue-400"/>
                                            <span>+251 911 37 61 45</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-blue-400"/>
                                            <span>+251 915 94 95 51</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-blue-400"/>
                                            <a href="mailto:info@ascii-technologies.com" className="hover:text-blue-300">info@ascii-technologies.com</a>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Contact Form */}
                                <motion.form onSubmit={handleFormSubmit} variants={fadeIn('left', 0.1, 0.6)} className="space-y-4">
                                    <h3 className="text-xl font-semibold text-white mb-3">Send us a Message</h3>
                                     <div>
                                        {/* Removed explicit labels for cleaner look like PDF, use placeholders */}
                                        <Input
                                            id="name" name="name" type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="Your Name" required
                                            className="bg-slate-700/50 border-slate-600/80 placeholder-gray-400 text-white rounded-md h-10 px-3 focus:border-blue-500 focus:ring-blue-500/50"
                                        />
                                    </div>
                                     <div>
                                        <Input
                                            id="email" name="email" type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="Your Email" required
                                            className="bg-slate-700/50 border-slate-600/80 placeholder-gray-400 text-white rounded-md h-10 px-3 focus:border-blue-500 focus:ring-blue-500/50"
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            id="message" name="message"
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            placeholder="Your Message" required rows={4}
                                            className="bg-slate-700/50 border-slate-600/80 placeholder-gray-400 text-white rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500/50"
                                        />
                                    </div>
                                    <div>
                                        <Button type="submit" className={`${primaryButtonStyle} text-base px-6 py-2`}>
                                            Send Message
                                        </Button>
                                    </div>
                                </motion.form>
                            </motion.div>
                        </section>

                    </div> {/* End Max Width Container */}
                </main>

                {/* --- Footer --- */}
                <footer className="w-full py-6 mt-16 border-t border-slate-700/50">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                        <p className="text-xs text-gray-400 mb-2 sm:mb-0">
                            © {new Date().getFullYear()} ASCII Technologies (Lumo). All rights reserved.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-xs text-gray-400 hover:text-white">Privacy</a>
                            <a href="#" className="text-xs text-gray-400 hover:text-white">Terms</a>
                            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="text-xs text-gray-400 hover:text-white">Contact</a>
                        </div>
                    </div>
                </footer>

            </div> {/* End Main Flex Container */}
        </div>
    )
}


// --- Reusable Feature Card Component ---
interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    delay?: number;
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
    return (
        <motion.div
            variants={fadeIn('up', delay, 0.5)}
            className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 p-5 rounded-lg border border-slate-700/50 text-center transition duration-300 ease-in-out hover:border-slate-600/80 hover:shadow-[0_0_20px_rgba(100,116,139,0.2)]" // Subtle glow on hover
        >
            <div className="mb-3 inline-flex items-center justify-center p-2.5 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30">
                 <Icon className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
            <p className="text-sm text-gray-400 leading-normal">{description}</p>
        </motion.div>
    );
}

// --- Reusable Step Card Component ---
interface StepCardProps {
    number: string;
    title: string;
    description: string;
    delay?: number;
}

function StepCard({ number, title, description, delay = 0 }: StepCardProps) {
    return (
        <motion.div variants={fadeIn('up', delay, 0.5)}>
            <div className="mb-3 inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-xl">
                {number}
            </div>
            <h3 className="text-xl font-semibold mb-1 text-white">{title}</h3>
            <p className="text-sm text-gray-400 leading-normal max-w-xs mx-auto">{description}</p>
        </motion.div>
    );
}