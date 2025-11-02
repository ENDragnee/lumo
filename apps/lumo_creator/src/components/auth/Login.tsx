// components/auth/LogIn.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import styled from "styled-components";
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

import Logo from "@/components/ui/Logo";
import { gradientShift } from "@/components/ui/animations";

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  background: linear-gradient(135deg, var(--bg-gradient-start, #f0f9ff), var(--bg-gradient-end, #e0f2fe));
  background-size: 200% 200%;
  animation: ${gradientShift} 15s ease infinite;
  transition: background 0.5s ease;

  .dark & {
    --bg-gradient-start: #0f172a; /* Dark blue/slate */
    --bg-gradient-end: #1e293b;
  }
`;

const SignInCard = styled.div`
  background-color: var(--card-bg, rgba(255, 255, 255, 0.1));
  color: var(--text-primary, #1f2937); /* Default text */
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  border: 1px solid var(--card-border-color, rgba(0, 0, 0, 0.05));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari support */

  .dark & {
    --card-bg: rgba(30, 41, 59, 0.6); /* Darker semi-transparent */
    --card-border-color: rgba(56, 189, 248, 0.15); /* Faint cyan border */
    --text-primary: #f8fafc; /* Light text */
    --text-secondary: #cbd5e1; /* Lighter secondary text */
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.3), 0 0 15px var(--neon-glow-1, rgba(34, 211, 238, 0.1));
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
  color: var(--text-secondary, #64748b); /* Default secondary */
  text-align: center;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.p`
  color: var(--error-color, #ef4444); /* Red */
  background-color: var(--error-bg-color, rgba(239, 68, 68, 0.1));
  font-size: 0.875rem;
  text-align: center;
  padding: 0.75rem 1rem; /* Slightly more padding */
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--error-color, #ef4444);
  line-height: 1.4;

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
  color: var(--input-icon-color, var(--text-secondary, #94a3b8));
  opacity: 0.7;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--input-border-color, #cbd5e1); /* Default border */
  border-radius: 8px;
  background-color: var(--input-bg-color, #f8fafc); /* Default bg */
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: var(--input-placeholder-color, var(--text-secondary, #94a3b8));
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: var(--focus-ring-color, #3b82f6);
    box-shadow: 0 0 0 3px var(--focus-ring-shadow, rgba(59, 130, 246, 0.2));
  }

  &:disabled {
      background-color: var(--input-disabled-bg, #e2e8f0);
      cursor: not-allowed;
      opacity: 0.7;
   }

  .dark & {
    --input-border-color: rgba(148, 163, 184, 0.3);
    --input-bg-color: rgba(51, 65, 85, 0.6);
    --input-icon-color: var(--text-secondary);
    --input-placeholder-color: rgba(148, 163, 184, 0.6);
    --focus-ring-color: #22d3ee; /* Cyan */
    --focus-ring-shadow: rgba(34, 211, 238, 0.25);
    --input-disabled-bg: rgba(51, 65, 85, 0.4);
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
  display: flex; // Ensure icon aligns well
  align-items: center;
  justify-content: center;

  &:hover { opacity: 1; }
  &:focus { outline: none; opacity: 1; }
  &:focus-visible {
    box-shadow: 0 0 0 2px var(--focus-ring-shadow, rgba(59, 130, 246, 0.2));
    border-radius: 4px;
  }
  svg { width: 18px; height: 18px; }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 0.5rem; /* Add gap for wrapping */
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

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    filter: brightness(1.1);
  }
  &:active:not(:disabled) {
    transform: translateY(0px) scale(0.98);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px var(--focus-ring-shadow, rgba(59, 130, 246, 0.2));
  }
   &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--button-disabled-bg, #9ca3af); /* Default disabled */
    box-shadow: none;
  }
  .dark & {
     --button-grad-start: #22d3ee; /* Cyan */
     --button-grad-end: #a78bfa; /* Violet */
     color: #0f172a;
     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
     --focus-ring-shadow: rgba(34, 211, 238, 0.25); /* Match input focus */
     &:disabled {
        background: linear-gradient(to right, rgba(34, 211, 238, 0.5), rgba(167, 139, 250, 0.5));
        color: rgba(15, 23, 42, 0.7);
        opacity: 0.7;
     }
  }
`;

const SecondaryLink = styled.a`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--link-color, #3b82f6);
  cursor: pointer;
  transition: color 0.2s ease, opacity 0.2s ease;
  margin-top: 0.5rem;
  text-decoration: none;

  &:hover {
    color: var(--link-hover-color, #2563eb);
    opacity: 0.9;
    text-decoration: underline;
  }

  .dark & {
    --link-color: #5eead4; /* Teal */
    --link-hover-color: #2dd4bf;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-secondary, #64748b);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.75rem 0; /* Consistent vertical margin */

  &::before, &::after {
    content: ''; flex: 1; border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
  }
  &::before { margin-right: 0.75em; }
  &::after { margin-left: 0.75em; }
  .dark & { --divider-color: rgba(255, 255, 255, 0.15); }
`;

const SocialLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
`;

const SignUpPrompt = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding-top: 1.5rem;
  border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
  margin-top: 0.25rem;
  .dark & { --divider-color: rgba(255, 255, 255, 0.1); }
`;

const SignUpLink = styled.button`
   font-weight: 600;
   margin-left: 0.25rem;
   background: none;
   border: none;
   cursor: pointer;
   color: var(--link-color, #3b82f6);
   transition: color 0.2s ease, opacity 0.2s ease;

   &:hover:not(:disabled) {
     color: var(--link-hover-color, #2563eb);
     opacity: 0.9;
     text-decoration: underline;
   }
   &:focus-visible {
       outline: none;
       text-decoration: underline;
       box-shadow: 0 0 0 2px var(--focus-ring-shadow, rgba(59, 130, 246, 0.2));
       border-radius: 3px;
   }
   &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    color: var(--text-secondary);
   }
   .dark & {
     --link-color: #5eead4;
     --link-hover-color: #2dd4bf;
     --focus-ring-shadow: rgba(34, 211, 238, 0.25);
     &:disabled { color: var(--text-secondary); }
   }
`;

// --- Component Logic ---

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();

  // Get callbackUrl from query parameters, default to /dashboard
  const callbackUrl = searchParams.get("callbackUrl");
  const defaultRedirectUrl = "/home";
  
  // Ensure the callbackUrl is a relative path to prevent open redirect vulnerabilities
  const safeCallbackUrl = (callbackUrl && callbackUrl.startsWith("/"))
    ? callbackUrl
    : defaultRedirectUrl;

  // Handle Auth Errors from URL query params
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
        let userMessage = "An authentication error occurred. Please try again.";
        switch (errorParam.toLowerCase()) {
            case "credentialssignin":
                userMessage = "Invalid email or password. Please check your details.";
                break;
            case "oauthaccountnotlinked":
                userMessage = "This email is linked to another sign-in method. Please use that method.";
                break;
            default:
                userMessage = "An unexpected error occurred during sign-in. Please try again.";
                break;
        }
        setError(userMessage);
        window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams]);

  // Apply theme class to body
  useEffect(() => {
      document.body.classList.remove('dark', 'light');
      if (resolvedTheme) {
        document.body.classList.add(resolvedTheme);
      }
  }, [resolvedTheme]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password.");
        } else if (result?.ok) {
            // Successful sign in, redirect to the safe callback URL or the dashboard
            router.push(safeCallbackUrl);
        } else {
             setError("An unexpected issue occurred during sign in.");
        }
    } catch (err: any) {
        setError(err.message || "An error occurred during sign in.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Container>
      <SignInCard>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <Title>Sign In</Title>
        <Subtitle>to continue to your dashboard</Subtitle>

        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

        <form onSubmit={handleCredentialsSubmit} noValidate>
          <InputWrapper>
            <InputIcon><FiMail size={18} /></InputIcon>
            <StyledInput
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
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
              disabled={isLoading}
              autoComplete="current-password"
            />
            <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
            >
                {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
            </PasswordToggle>
          </InputWrapper>

          <ActionsWrapper>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </PrimaryButton>
            <SecondaryLink href="/auth/forgot-password">
              Forgot Password?
            </SecondaryLink>
          </ActionsWrapper>
        </form>

        <Divider>OR</Divider>

        <SocialLoginWrapper>
        </SocialLoginWrapper>

        <SignUpPrompt>
          Don't have an account?
          <SignUpLink
             type="button"
             onClick={() => !isLoading && router.push(`https://easy-learning-two.vercel.app/auth/signup?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`)}
             disabled={isLoading}
          >
            Sign Up
          </SignUpLink>
        </SignUpPrompt>
      </SignInCard>
    </Container>
  );
}
