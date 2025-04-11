"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import styled from "styled-components";
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'; // Example icons

// Assuming GlobalStyle with CSS Variables is applied in your layout
// Import shared components and animations if applicable
import Logo from "./ui/Logo";
import { gradientShift } from "./ui/animations"; // Import shared animation

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; // Consistent font

  /* Animated Gradient Background - Reuse from GlobalStyle */
  background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
  background-size: 200% 200%;
  animation: ${gradientShift} 15s ease infinite;
  transition: background 0.5s ease;

  /* Optional: Subtle Grid Overlay - Reuse from GlobalStyle if desired */
  /* &::before { ... } */
`;

const SignInCard = styled.div`
  background-color: var(--card-bg, rgba(255, 255, 255, 0.1)); /* Use variable, fallback for light */
  color: var(--text-primary);
  padding: 2rem 2.5rem; /* More padding */
  border-radius: 12px; /* Slightly larger radius */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px; /* Consistent max-width */
  position: relative;
  z-index: 1;
  border: 1px solid var(--card-border-color, rgba(255, 255, 255, 0.2)); /* Subtle border */
  backdrop-filter: blur(10px); /* Frosted glass effect */

  /* Theme-specific overrides using variables */
  .dark & {
    --card-bg: rgba(41, 46, 57, 0.5); /* Dark semi-transparent */
    --card-border-color: rgba(56, 189, 248, 0.15); /* Faint cyan border */
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.3), 0 0 15px var(--neon-glow-1, #22d3ee); /* Subtle outer glow */
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
  color: var(--text-primary);
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.p`
  color: var(--error-color, #ef4444); /* Red */
  background-color: var(--error-bg-color, rgba(239, 68, 68, 0.1));
  font-size: 0.875rem;
  text-align: center;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--error-color, #ef4444);

  .dark & {
      --error-color: #f87171; /* Lighter red for dark */
      --error-bg-color: rgba(248, 113, 113, 0.15);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.25rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--input-icon-color, var(--text-secondary));
  opacity: 0.7;
  pointer-events: none; /* Make icon non-interactive */
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem; /* Adjusted padding for icon */
  border: 1px solid var(--input-border-color, var(--color-slate-300));
  border-radius: 8px;
  background-color: var(--input-bg-color, var(--color-slate-50));
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: var(--input-placeholder-color, var(--text-secondary));
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: var(--focus-ring-color, #3b82f6);
    box-shadow: 0 0 0 3px var(--focus-ring-shadow, rgba(59, 130, 246, 0.2));
  }

  /* Theme-specific variables */
  .dark & {
    --input-border-color: rgba(148, 163, 184, 0.3); /* Slate 400 / 30% */
    --input-bg-color: rgba(51, 65, 85, 0.6);     /* Slate 700 / 60% */
    --input-icon-color: var(--text-secondary);
    --input-placeholder-color: rgba(148, 163, 184, 0.6); /* Slate 400 / 60% */
    --focus-ring-color: #22d3ee; /* Cyan */
    --focus-ring-shadow: rgba(34, 211, 238, 0.25);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--input-icon-color, var(--text-secondary));
  opacity: 0.8;
  padding: 0.25rem;

  &:hover {
    opacity: 1;
  }
  &:focus {
      outline: none;
      opacity: 1;
      box-shadow: 0 0 0 2px var(--focus-ring-shadow); /* Focus ring */
      border-radius: 4px;
   }

   /* Slightly larger icon size */
   svg {
       width: 18px;
       height: 18px;
   }
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  flex-wrap: wrap; /* Allow wrapping on small screens */
`;

const PrimaryButton = styled.button`
  padding: 0.7rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(to right, var(--button-grad-start, #3b82f6), var(--button-grad-end, #6366f1));
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0px) scale(0.98);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible { /* Better focus outline */
      outline: none;
      box-shadow: 0 0 0 3px var(--focus-ring-shadow);
  }

  /* Dark theme button */
  .dark & {
     --button-grad-start: #22d3ee; /* Cyan */
     --button-grad-end: #a78bfa; /* Violet */
     color: #0f172a; /* Dark text on bright button */
     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const SecondaryLink = styled.a`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--link-color, #3b82f6);
  cursor: pointer;
  transition: color 0.2s ease, opacity 0.2s ease;
  margin-top: 0.5rem; /* Add margin for wrap scenario */

  &:hover {
    color: var(--link-hover-color, #2563eb);
    opacity: 0.9;
  }

  .dark & {
    --link-color: #5eead4; /* Teal */
    --link-hover-color: #2dd4bf;
  }
`;

const SignUpPrompt = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding-top: 1.5rem;
  border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
  margin-top: 1rem;

  .dark & {
      --divider-color: rgba(255, 255, 255, 0.1);
  }
`;

const SignUpLink = styled.button`
   font-weight: 600;
   margin-left: 0.25rem;
   background: none;
   border: none;
   cursor: pointer;
   color: var(--link-color, #3b82f6);
   transition: color 0.2s ease, opacity 0.2s ease;

   &:hover {
     color: var(--link-hover-color, #2563eb);
     opacity: 0.9;
   }

   .dark & {
     --link-color: #5eead4; /* Teal */
     --link-hover-color: #2dd4bf;
   }
`;

// --- Component Logic ---

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();
  const { resolvedTheme } = useTheme(); // Use resolvedTheme

  // Set theme class on body (needed for .dark selector)
  useEffect(() => {
      document.body.classList.remove('dark', 'light');
      if (resolvedTheme) {
        document.body.classList.add(resolvedTheme);
      }
  }, [resolvedTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Start loading

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // Handle redirect manually
        });

        if (result?.error) {
            // More specific error mapping could be done here if needed
            setError(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error);
        } else if (result?.ok) {
            router.push("/main"); // Redirect on successful sign in
        } else {
            setError("An unexpected error occurred. Please try again.");
        }
    } catch (err) {
        console.error("Sign in error:", err);
        setError("An error occurred during sign in.");
    } finally {
        setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <Container>
      <SignInCard>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <Title>Sign In</Title>
        <Subtitle>to continue to Lumo</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <InputIcon><FiMail size={18} /></InputIcon>
            <StyledInput
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // Add basic HTML validation
              disabled={isLoading}
            />
          </InputWrapper>

          <InputWrapper>
            <InputIcon><FiLock size={18} /></InputIcon>
            <StyledInput
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4} // Example: Basic validation
              disabled={isLoading}
            />
            <PasswordToggle
                type="button" // Prevent form submission
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
            >
                {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
            </PasswordToggle>
          </InputWrapper>

          <ActionsWrapper>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </PrimaryButton>
            {/* Add target="_blank" rel="noopener noreferrer" if it links externally */}
            <SecondaryLink href="/auth/forgot-password">
              Forgot Password?
            </SecondaryLink>
          </ActionsWrapper>
        </form>

         {/* Optional Divider for Social Logins */}
        {/*
        <Divider>Or sign in with</Divider>
        <SocialLoginWrapper>
             <SocialButton provider="google" onClick={() => signIn('google')}>
                <GoogleIcon /> Sign in with Google
             </SocialButton>
             {/* Add other providers */}
        {/* </SocialLoginWrapper>
        */}

        <SignUpPrompt>
          Don't have an account?
          <SignUpLink onClick={() => !isLoading && router.push("/auth/signup")}>
            Sign Up
          </SignUpLink>
        </SignUpPrompt>
      </SignInCard>
    </Container>
  );
}