// components/auth/GoogleSignInButton.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";

// --- Styled Components ---

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

// --- Component Logic ---
interface GoogleSignInButtonProps {
  callbackUrl: string;
  disabled?: boolean;
  setError?: (error: string) => void;
}

export default function GoogleSignInButton({ callbackUrl, disabled = false, setError }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    // Clear previous errors from the parent component if a handler is provided
    setError?.("");
    setIsLoading(true);

    try {
      // NextAuth handles the full redirect flow. On success, it will go to the
      // callbackUrl. On error, it will return to this page with an error param.
      await signIn("google", {
        callbackUrl: callbackUrl,
      });
      // On successful initiation, the page redirects, so we don't need to set isLoading to false.
    } catch (error: any) {
      // This catches rare errors during the *initiation* of the sign-in process.
      console.error("Google Sign In Initiation Error:", error);
      setError?.("Failed to start Google Sign-In. Please check your network or try again.");
      setIsLoading(false);
    }
  };

  const isButtonDisabled = disabled || isLoading;

  return (
    <SocialButton
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isButtonDisabled}
      aria-label="Sign in with Google"
    >
      {isLoading ? (
        <>Signing in with Google...</>
      ) : (
        <>
          <FcGoogle aria-hidden="true" /> Sign in with Google
        </>
      )}
    </SocialButton>
  );
}
