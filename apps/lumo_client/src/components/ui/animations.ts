// src/components/ui/animations.ts (Example Path)
import { keyframes } from 'styled-components';

// Make sure it's EXPORTED
export const neonGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 2px var(--neon-glow-1),
                 0 0 5px var(--neon-glow-1),
                 0 0 8px var(--neon-glow-2),
                 0 0 12px var(--neon-glow-2);
    opacity: 0.95;
  }
  50% {
    text-shadow: 0 0 3px var(--neon-glow-1),
                 0 0 8px var(--neon-glow-1),
                 0 0 13px var(--neon-glow-2),
                 0 0 20px var(--neon-glow-2);
    opacity: 1;
  }
`;

// Export other animations if they exist in this file
export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Add other shared keyframes like pulse if needed