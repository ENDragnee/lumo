
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useSession } from "next-auth/react";

// --- Keyframes ---

// Enhanced Glow - More vibrant and focused
const neonGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 3px var(--neon-glow-1),
                 0 0 7px var(--neon-glow-1),
                 0 0 12px var(--neon-glow-2),
                 0 0 20px var(--neon-glow-2);
    opacity: 0.9;
  }
  50% {
    text-shadow: 0 0 5px var(--neon-glow-1),
                 0 0 10px var(--neon-glow-1),
                 0 0 18px var(--neon-glow-2),
                 0 0 30px var(--neon-glow-2);
    opacity: 1;
  }
`;

// Futuristic Loader Animation - Pulsating Core
const pulse = keyframes`
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 var(--loader-pulse-color-start);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 10px 15px var(--loader-pulse-color-end);
  }
  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 var(--loader-pulse-color-end);
  }
`;

// Subtle Background Gradient Shift
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- Global Styles (for CSS Variables) ---
// We define variables here to be easily accessible by styled-components
const GlobalStyle = createGlobalStyle`
  :root {
    /* Default (Light Theme) */
    --bg-gradient-start: #e0f2fe; /* Light blue */
    --bg-gradient-end: #f3e8ff; /* Light purple */
    --text-primary: #1f2937; /* Dark gray */
    --text-secondary: #4b5563;
    --neon-glow-1: #3b82f6; /* Blue */
    --neon-glow-2: #6366f1; /* Indigo */
    --loader-core: #6366f1;
    --loader-pulse-color-start: rgba(99, 102, 241, 0.5);
    --loader-pulse-color-end: rgba(99, 102, 241, 0);
    --footer-text: #6b7280;
    --grid-color: rgba(59, 130, 246, 0.1); /* Faint blue grid */
  }

  .dark {
    /* Dark Theme Override */
    --bg-gradient-start: #0f172a; /* Dark Slate */
    --bg-gradient-end: #1e1b4b; /* Deep Indigo */
    --text-primary: #e0f2fe; /* Light Cyan/Blue */
    --text-secondary: #94a3b8; /* Slate 400 */
    --neon-glow-1: #22d3ee; /* Cyan */
    --neon-glow-2: #a78bfa; /* Violet */
    --loader-core: #22d3ee; /* Cyan */
    --loader-pulse-color-start: rgba(34, 211, 238, 0.6); /* Cyan pulse */
    --loader-pulse-color-end: rgba(34, 211, 238, 0);
    --footer-text: #64748b; /* Slate 500 */
    --grid-color: rgba(56, 189, 248, 0.07); /* Fainter sky blue grid */
  }
`;

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: var(--text-primary);
  text-align: center;
  padding: 1rem;
  overflow: hidden; /* Prevent scrollbars from gradient */
  position: relative; /* Needed for pseudo-element grid */

  /* Animated Gradient Background */
  background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
  background-size: 200% 200%; /* Increase size for smooth animation */
  animation: ${gradientShift} 15s ease infinite;
  transition: background 0.5s ease; /* Smooth theme change */

  /* Subtle Grid Overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(to right, var(--grid-color) 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.5; /* Make it very subtle */
    pointer-events: none; /* Allow clicks through */
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  position: relative; /* Ensure content is above grid */
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.h1` /* Changed to h1 for semantics */
  font-size: 4.5rem;
  font-weight: 700; /* Bolder */
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-family: 'Orbitron', sans-serif; /* Example futuristic font - add import if needed */
  /* Apply Neon Glow Animation */
  animation: ${neonGlow} 2.5s ease-in-out infinite alternate;
  cursor: default; /* Indicate it's not interactive */
  transition: transform 0.3s ease, text-shadow 0.3s ease;

  /* Subtle hover interaction */
  &:hover {
    transform: scale(1.03);
    text-shadow: 0 0 6px var(--neon-glow-1),
                 0 0 14px var(--neon-glow-1),
                 0 0 25px var(--neon-glow-2),
                 0 0 40px var(--neon-glow-2);
  }

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
  @media (max-width: 480px) {
    font-size: 3rem;
  }
`;

const BodyText = styled.p` /* Changed to p for semantics */
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  color: var(--text-secondary);
  max-width: 400px;
  line-height: 1.6;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
`;

// Futuristic Pulsating Core Loader
const Loader = styled.div`
  width: 45px;
  height: 45px;
  margin: 2.5rem auto;
  background-color: var(--loader-core);
  border-radius: 50%;
  position: relative; /* For potential inner elements */
  animation: ${pulse} 1.8s infinite cubic-bezier(0.215, 0.610, 0.355, 1); /* Smoother pulse */

  /* Optional: Add inner core or rings */
  /* &::before {
    content: '';
    position: absolute;
    inset: 5px;
    background: var(--bg-gradient-end); // Match background
    border-radius: 50%;
  } */
`;

const Footer = styled.div`
  font-size: 0.85rem;
  color: var(--footer-text);
  position: fixed;
  bottom: 1.5rem;
  opacity: 0.8;
  z-index: 1; /* Above grid */
`;

// --- Component ---

const LoadingScreen = () => {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme(); // Use resolvedTheme for reliable dark/light check
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  // Redirect logic remains the same
  const handleRoute = () => {
    if (status === "loading") return; // Still wait for session
    router.push(session ? `/dashboard` : "/landing"); 
  };

  // Ensure component is mounted before doing anything client-side
  useEffect(() => {
    setMounted(true);

    // Optional: Preload futuristic font if using one
    // const link = document.createElement('link');
    // link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap";
    // link.rel = 'stylesheet';
    // document.head.appendChild(link);
  }, []);

  // Set the correct theme class on the body when theme changes
  useEffect(() => {
    if (!mounted) return;
    document.body.classList.remove('dark', 'light'); // Clear previous
    if (resolvedTheme) {
      document.body.classList.add(resolvedTheme);
    }
  }, [resolvedTheme, mounted]);


  // Timer logic remains the same
  useEffect(() => {
    if (!mounted || status === 'loading') return; // Only run timer when mounted and session status is resolved

    const timer = setTimeout(() => {
      handleRoute();
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, status, session]); // Rerun when mount status or session status changes

  if (!mounted) return null; // Prevents SSR flicker and ensures theme is ready

  return (
    <>
      <GlobalStyle /> {/* Inject CSS Variables */}
      <Container>
        <ContentWrapper>
          <Logo>Lumo</Logo>
          <BodyText>Learning Management, reimagined for the future.</BodyText>
          <Loader />
        </ContentWrapper>
        <Footer>Powered by ASCII Technologies</Footer> {/* Updated Footer Text */}
      </Container>
    </>
  );
};

export default LoadingScreen;
