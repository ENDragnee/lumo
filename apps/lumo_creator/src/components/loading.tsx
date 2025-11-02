'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import styled, { keyframes } from 'styled-components';
import { useSession } from "next-auth/react"


const glow = keyframes`
  from {
    text-shadow: 0 0 5px var(--glow-light),
                 0 0 10px var(--glow-light),
                 0 0 15px var(--glow-main),
                 0 0 20px var(--glow-main);
  }
  to {
    text-shadow: 0 0 10px var(--glow-light),
                 0 0 20px var(--glow-light),
                 0 0 30px var(--glow-main),
                 0 0 40px var(--glow-main);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--text);
  text-align: center;
  transition: background 0.3s, color 0.3s;
`;

const Logo = styled.div`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  animation: ${glow} 2s ease-in-out infinite alternate;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const BodyText = styled.div`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0 1rem;
  }
`;

const Footer = styled.div`
  font-size: 1rem;
  opacity: 0.7;
  position: fixed;
  bottom: 2rem;
`;

const Loader = styled.div`
  width: 50px;
  height: 50px;
  margin: 2rem auto;
  border: 5px solid var(--loader-bg);
  border-top: 5px solid var(--loader-main);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  box-shadow: 0 0 15px var(--loader-main);
`;

const LoadingScreen = () => {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  const handleRoute = () => {
    if (status === "loading") return; // Wait for session to resolve
    if (session) {
      router.push("/home");
    } else {
      router.push("/auth/signin");
    }
  };

  // Ensure the theme has been resolved before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.style.setProperty('--background', '#0f172a');
      root.style.setProperty('--text', '#add8e6');
      root.style.setProperty('--glow-light', '#add8e6');
      root.style.setProperty('--glow-main', '#87ceeb');
      root.style.setProperty('--loader-bg', '#222');
      root.style.setProperty('--loader-main', '#add8e6');
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--text', '#1a202c');
      root.style.setProperty('--glow-light', '#87ceeb');
      root.style.setProperty('--glow-main', '#1a73e8');
      root.style.setProperty('--loader-bg', '#e2e8f0');
      root.style.setProperty('--loader-main', '#1a73e8');
    }
  }, [resolvedTheme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      handleRoute();
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [mounted, session, status]);

  if (!mounted) return null; // Prevent initial flicker

  return (
    <Container>
      <Logo>Lumo Creators</Logo>
      <BodyText>Create contents that are fun and interactive</BodyText>
      <Loader />
      <Footer>Powered by SAAS Founders</Footer>
    </Container>
  );
};

export default LoadingScreen;