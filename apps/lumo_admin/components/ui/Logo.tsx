// src/components/ui/Logo.tsx
import styled from 'styled-components';
import { neonGlow } from './animations';

// Rest of the component code...

const LogoText = styled.h1`
  // ... other styles
  animation: ${neonGlow} 2.5s ease-in-out infinite alternate; // Use the imported animation
  // ... other styles
`;

const Logo = () => {
  return <LogoText>{process.env.NEXT_PUBLIC_PROJECT_NAME}</LogoText>;
};

export default Logo;
