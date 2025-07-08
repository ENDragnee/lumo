// @/component/ui/loader
"use client";

import styled, { keyframes } from 'styled-components';
import Logo from './Logo'; // Assuming your Logo component is here

// --- Keyframe Animations for the elegant effect ---

// Animation for the background aurora glow to slowly shift its colors
const auroraShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Animation for the expanding ripple effect
const ripple = keyframes`
  from {
    transform: scale(0.5);
    opacity: 0.75;
  }
  to {
    transform: scale(2.5);
    opacity: 0;
  }
`;

// Animation for the central logo to have a soft, breathing pulse
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px var(--glow-color-1, rgba(59, 130, 246, 0.3)));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 15px var(--glow-color-1, rgba(59, 130, 246, 0.5)));
  }
`;

// --- Styled Components ---

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh; // Take up the full viewport height
  background-color: var(--bg-primary, #f8fafc); // Fallback background
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  position: fixed; // Position over everything
  top: 0;
  left: 0;
  z-index: 9999;
`;

const OrbWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// The soft, blurry background glow
const AuroraGlow = styled.div`
  position: absolute;
  width: 200%;
  height: 200%;
  border-radius: 50%;
  background: linear-gradient(
    135deg, 
    var(--glow-color-1, #3b82f6), 
    var(--glow-color-2, #8b5cf6)
  );
  background-size: 200% 200%;
  filter: blur(60px); // This creates the soft aurora effect
  animation: ${auroraShift} 10s ease infinite;

  .dark & {
    --glow-color-1: #22d3ee;
    --glow-color-2: #a78bfa;
  }
`;

// The expanding rings/ripples
const PulsingRing = styled.div<{ delay?: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--ring-color, rgba(59, 130, 246, 0.5));
  animation: ${ripple} 2.5s infinite cubic-bezier(0.21, 0.6, 0.35, 1);
  animation-delay: ${({ delay }) => delay || '0s'};

  .dark & {
    --ring-color: rgba(34, 211, 238, 0.4);
  }
`;

// The container for the central, pulsating logo
const LogoContainer = styled.div`
  z-index: 2; // Keep logo above the glow and rings
  animation: ${pulse} 3s ease-in-out infinite;

  // The Logo itself might have styles, we just animate the container
  svg, img {
    width: 60px;
    height: 60px;
  }
`;

const LoadingText = styled.p`
  margin-top: 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  opacity: 0.8;
`;
type LoaderProps = {
  page?: string;
}
export default function Loader({ page }: LoaderProps) {
  return (
    <LoaderContainer>
      <OrbWrapper>
        <AuroraGlow />
        <PulsingRing />
        <PulsingRing delay="1.25s" />
        <LogoContainer>
          <Logo />
        </LogoContainer>
      </OrbWrapper>
      <LoadingText>{page} is Initializing...</LoadingText>
    </LoaderContainer>
  );
}
