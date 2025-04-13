// components/SignIn.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { useTheme } from "next-themes";
import styled from "styled-components";
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from "react-icons/fc"; // Import Google icon

// Assuming GlobalStyle with CSS Variables is applied in your layout
// Import shared components and animations if applicable
import Logo from "./ui/Logo"; // Adjust path if necessary
import { gradientShift } from "./ui/animations"; // Adjust path if necessary

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

  background: linear-gradient(135deg, var(--bg-gradient-start, #f0f9ff), var(--bg-gradient-end, #e0f2fe)); /* Example default gradient */
  background-size: 200% 200%;
  animation: ${gradientShift} 15s ease infinite;
  transition: background 0.5s ease;

  /* Optional: Subtle Grid Overlay */
  /* &::before { ... } */

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

  &:hover {
    opacity: 1;
  }
  &:focus {
      outline: none;
      opacity: 1;
  }
   &:focus-visible {
      box-shadow: 0 0 0 2px var(--focus-ring-shadow, rgba(59, 130, 246, 0.2));
      border-radius: 4px;
   }

   svg {
       width: 18px;
       height: 18px;
   }

   &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
   }
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

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
  }

  &::before { margin-right: 0.75em; }
  &::after { margin-left: 0.75em; }

  .dark & {
    --divider-color: rgba(255, 255, 255, 0.15);
  }
`;

const SocialLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 1rem;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--input-border-color, #cbd5e1);
  background-color: var(--input-bg-color, #f8fafc);
  color: var(--text-primary);

  &:hover:not(:disabled) {
    background-color: var(--button-hover-bg, rgba(0, 0, 0, 0.03));
    border-color: var(--input-border-hover-color, #9ca3af);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0, 0.05);
  }

  &:active:not(:disabled) {
      transform: translateY(0px);
      box-shadow: inset 0 1px 3px rgba(0,0,0, 0.1);
  }

  &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px var(--focus-ring-shadow, rgba(59, 130, 246, 0.2));
      border-color: var(--focus-ring-color, #3b82f6);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }

  .dark & {
    --input-border-color: rgba(148, 163, 184, 0.3);
    --input-bg-color: rgba(51, 65, 85, 0.4);
    --button-hover-bg: rgba(255, 255, 255, 0.05);
    --input-border-hover-color: rgba(148, 163, 184, 0.5);
    --focus-ring-color: #22d3ee; /* Cyan */
    --focus-ring-shadow: rgba(34, 211, 238, 0.25);
  }
`;


const SignUpPrompt = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding-top: 1.5rem;
  border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
  margin-top: 0.25rem; /* Reduced margin-top as SocialLoginWrapper has margin-bottom */

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

   &:hover:not(:disabled) {
     color: var(--link-hover-color, #2563eb);
     opacity: 0.9;
     text-decoration: underline;
   }

   &:focus-visible {
       outline: none;
       text-decoration: underline;
       box-shadow: 0 0 0 2px var(--focus-ring-shadow, rgba(59, 130, 246, 0.2)); /* Simple focus ring */
       border-radius: 3px; /* Rounded focus ring */
   }

   &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    color: var(--text-secondary); /* Muted color when disabled */
   }

   .dark & {
     --link-color: #5eead4; /* Teal */
     --link-hover-color: #2dd4bf;
     --focus-ring-shadow: rgba(34, 211, 238, 0.25);

     &:disabled {
       color: var(--text-secondary);
     }
   }
`;

// --- Component Logic ---

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading for Credentials
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Loading for Google
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();

  // Handle Auth Errors from URL query params
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
        let userMessage = "An authentication error occurred. Please try again."; // Default
        switch (errorParam.toLowerCase()) { // Use lowercase for case-insensitivity
            case "credentialssignin":
                userMessage = "Invalid email or password. Please check your details.";
                break;
            case "oauthaccountnotlinked":
            case "accountconflict": // Treat custom error similarly
                userMessage = "This email is already linked to another sign-in method (like Google or Credentials). Please sign in using that method.";
                break;
            case "emailsigninerror":
            case "callback": // Generic callback error
                userMessage = "There was an issue during the sign-in process. Please try again.";
                break;
            case "oauthcallback":
                 userMessage = "Error returning from the sign-in provider. Please try again.";
                 break;
            // Add more specific NextAuth errors as needed:
            // https://next-auth.js.org/configuration/pages#error-codes
            default:
                console.warn("Unhandled NextAuth error code:", errorParam);
                // Use the default message
                break;
        }
        setError(userMessage);
        // Clean the URL - Replace current entry in history, doesn't trigger reload
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
    setError(""); // Clear previous errors
    setIsLoading(true);
    setIsGoogleLoading(false); // Ensure only one loader is active

    try {
        // Use redirect: false to handle errors/redirects manually
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            // callbackUrl: "/main", // Specify success redirect if needed here or in authOptions
        });

        if (result?.error) {
            // This will usually be handled by the useEffect hook reading URL params
            // but we can set a fallback error message if the redirect doesn't happen
            console.error("Credentials Sign In Error (returned obj):", result.error);
            if (!searchParams?.get("error")) { // Only set if not already handled by URL
                setError("Invalid email or password.");
            }
        } else if (result?.ok) {
            // Successful sign in
            router.push("/main"); // Redirect to the main page or dashboard
            // Optionally refresh router state if needed, though push usually suffices
            // router.refresh();
        } else {
            // Handle unexpected non-error, non-ok result
             setError("An unexpected issue occurred during sign in.");
        }
    } catch (err: any) {
        console.error("Credentials Sign In Submit Error:", err);
        setError(err.message || "An error occurred during sign in.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(""); // Clear previous errors
    setIsLoading(false); // Ensure only one loader is active
    setIsGoogleLoading(true);

    try {
        // Use redirect: true (default) - NextAuth handles the redirects.
        // Errors during the OAuth flow will redirect back here with ?error=...
        // Success will redirect to callbackUrl defined in authOptions or '/main' here.
        await signIn("google", {
            callbackUrl: "/main", // Where to go after successful Google auth
        });
        // If signIn initiates successfully, the page redirects, so code below here
        // might not execute unless there's an immediate client-side error.
    } catch (error: any) {
        // Catch errors *initiating* the sign-in (rare)
        console.error("Google Sign In Initiation Error:", error);
        setError("Failed to start Google Sign-In. Check network or try again.");
        setIsGoogleLoading(false); // Stop loading if initiation failed
    }
    // No finally block to set isGoogleLoading=false if redirect=true,
    // as the component might unmount before it runs. Loading stops on navigation.
  };

  // Combined loading state for disabling elements
  const isSubmitting = isLoading || isGoogleLoading;

  return (
    <Container>
      <SignInCard>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <Title>Sign In</Title>
        <Subtitle>to continue to Lumo</Subtitle>

        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} noValidate>
          <InputWrapper>
            <InputIcon><FiMail size={18} /></InputIcon>
            <StyledInput
              type="email"
              id="email" // Add id for label association (optional)
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              autoComplete="email"
              aria-label="Email Address" // Aria label for accessibility
            />
          </InputWrapper>

          <InputWrapper>
            <InputIcon><FiLock size={18} /></InputIcon>
            <StyledInput
              type={showPassword ? "text" : "password"}
              id="password" // Add id for label association (optional)
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4} // Keep basic client-side validation
              disabled={isSubmitting}
              autoComplete="current-password"
              aria-label="Password" // Aria label
            />
            <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isSubmitting}
            >
                {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
            </PasswordToggle>
          </InputWrapper>

          <ActionsWrapper>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isLoading ? "Signing In..." : "Sign In"}
            </PrimaryButton>
            <SecondaryLink href="/auth/forgot-password" /* onClick={(e) => { e.preventDefault(); router.push('/auth/forgot-password'); }} if using router */ >
              Forgot Password?
            </SecondaryLink>
          </ActionsWrapper>
        </form>

         {/* Divider */}
        <Divider>OR</Divider>

        {/* Social Logins */}
        <SocialLoginWrapper>
             <SocialButton
                type="button" // Explicitly type as button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                aria-label="Sign in with Google"
             >
                {isGoogleLoading ? (
                   // Basic loading text, replace with spinner component if desired
                   <>Signing in with Google...</>
                 ) : (
                   <>
                     <FcGoogle aria-hidden="true" /> Sign in with Google
                   </>
                 )}
             </SocialButton>
             {/* Add buttons for other providers here if needed */}
        </SocialLoginWrapper>


        <SignUpPrompt>
          Don't have an account?
          <SignUpLink
             type="button"
             onClick={() => !isSubmitting && router.push("/auth/signup")}
             disabled={isSubmitting}
          >
            Sign Up
          </SignUpLink>
        </SignUpPrompt>
      </SignInCard>
    </Container>
  );
}