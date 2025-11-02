// components/auth/SignUp.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import styled, { css } from "styled-components";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiChevronRight, FiUser } from 'react-icons/fi';

import Logo from "@/components/ui/Logo";
import { gradientShift } from "@/components/ui/animations";
import GoogleSignInButton from "./GoogleSignInButton";

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
  .dark & { --bg-gradient-start: #0f172a; --bg-gradient-end: #1e293b; }
`;

const SignUpCard = styled.div`
  background-color: var(--card-bg, rgba(255, 255, 255, 0.1));
  color: var(--text-primary);
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  border: 1px solid var(--card-border-color, rgba(255, 255, 255, 0.2));
  backdrop-filter: blur(10px);
  .dark & {
    --card-bg: rgba(30, 41, 59, 0.6);
    --card-border-color: rgba(56, 189, 248, 0.15);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.3), 0 0 15px var(--neon-glow-1, rgba(34, 211, 238, 0.1));
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
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: var(--error-color, #ef4444);
  background-color: var(--error-bg-color, rgba(239, 68, 68, 0.1));
  font-size: 0.875rem;
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid var(--error-color, #ef4444);
  .dark & {
    --error-color: #f87171;
    --error-bg-color: rgba(248, 113, 113, 0.15);
  }
`;

const FormContainer = styled.form`
    width: 100%;
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
  pointer-events: none;
`;

const BaseInputStyles = css`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--input-border-color, #cbd5e1);
  border-radius: 8px;
  background-color: var(--input-bg-color, #f8fafc);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  &::placeholder { color: var(--input-placeholder-color, var(--text-secondary)); opacity: 0.8; }
  &:focus {
    outline: none;
    border-color: var(--focus-ring-color, #3b82f6);
    box-shadow: 0 0 0 3px var(--focus-ring-shadow, rgba(59, 130, 246, 0.2));
  }
  &:disabled {
      background-color: var(--input-disabled-bg, rgba(200, 200, 200, 0.2));
      cursor: not-allowed;
      opacity: 0.7;
  }
  &.has-right-element { padding-right: 2.8rem; }
  .dark & {
    --input-border-color: rgba(148, 163, 184, 0.3);
    --input-bg-color: rgba(51, 65, 85, 0.6);
    --focus-ring-color: #22d3ee;
    --focus-ring-shadow: rgba(34, 211, 238, 0.25);
  }
`;

const StyledInput = styled.input`${BaseInputStyles}`;
const StyledSelect = styled.select`${BaseInputStyles} appearance: none;`;

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
  z-index: 3;
  &:hover { opacity: 1; }
  svg { width: 18px; height: 18px; }
`;

const PrimaryButton = styled.button`
  width: 100%;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    filter: brightness(1.1);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; background: var(--button-disabled-bg, #a0aec0); }
  .dark & {
     --button-grad-start: #22d3ee;
     --button-grad-end: #a78bfa;
     color: #0f172a;
  }
`;

const SocialLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.75rem 0;
`;

const SignInPrompt = styled.div`
  text-align: center; font-size: 0.9rem; color: var(--text-secondary);
  margin-top: 1.5rem; border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08)); padding-top: 1.5rem;
  .dark & { --divider-color: rgba(255, 255, 255, 0.1); }
`;

const SignInLink = styled.button`
   font-weight: 600; margin-left: 0.25rem; background: none; border: none;
   cursor: pointer; color: var(--link-color, #3b82f6);
   &:hover:not(:disabled) { text-decoration: underline; color: var(--link-hover-color, #2563eb); }
   .dark & { --link-color: #5eead4; --link-hover-color: #2dd4bf; }
`;

// --- Component Logic ---

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();

  const callbackUrl = searchParams.get("callbackUrl");
  const defaultRedirectUrl = "/dashboard";
  const safeCallbackUrl = (callbackUrl && callbackUrl.startsWith("/"))
    ? callbackUrl
    : defaultRedirectUrl;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [otp, setOtp] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isAwaitingOtp, setIsAwaitingOtp] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.remove('dark', 'light');
    if (resolvedTheme) document.body.classList.add(resolvedTheme);
  }, [resolvedTheme]);
  
  const handleSendOtp = async () => {
    // This is a simplified validation. Add more robust checks as needed.
    if (!firstName || !lastName || !email || !password || password !== confirmPassword) {
      setError("Please fill all fields correctly. Passwords must match.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP.");
      setIsAwaitingOtp(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAwaitingOtp) {
      handleSendOtp();
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, gender, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign-up failed. The OTP may be incorrect or expired.");

      // Auto sign-in after successful sign-up
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        // Successful sign-in, redirect to the desired page
        router.push(safeCallbackUrl);
      } else {
        // Fallback: Auto sign-in failed, redirect to login page with a success message
        router.push(`/auth/signin?signup=success&callbackUrl=${encodeURIComponent(safeCallbackUrl)}`);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <SignUpCard>
        <LogoWrapper><Logo /></LogoWrapper>
        <Title>{isAwaitingOtp ? 'Verify Your Email' : 'Create an Account'}</Title>
        <Subtitle>{isAwaitingOtp ? `Enter the 6-digit code sent to ${email}` : 'Join us in a few clicks.'}</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormContainer onSubmit={handleSignUp}>
            {isAwaitingOtp ? (
                <InputWrapper>
                    <StyledInput
                        type="text" placeholder="------" value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        required maxLength={6} disabled={isLoading}
                        style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem', paddingLeft: '1rem' }}
                    />
                </InputWrapper>
            ) : (
                <>
                    <InputWrapper><InputIcon><FiUser size={18} /></InputIcon><StyledInput type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isLoading} /></InputWrapper>
                    <InputWrapper><InputIcon><FiUser size={18} /></InputIcon><StyledInput type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isLoading} /></InputWrapper>
                    <InputWrapper><InputIcon><FiMail size={18} /></InputIcon><StyledInput type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} /></InputWrapper>
                    <InputWrapper>
                        <InputIcon><FiLock size={18} /></InputIcon>
                        <StyledInput type={showPassword ? "text" : "password"} placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={isLoading} className="has-right-element" />
                        <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}</PasswordToggle>
                    </InputWrapper>
                    <InputWrapper><InputIcon><FiLock size={18} /></InputIcon><StyledInput type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} disabled={isLoading} /></InputWrapper>
                    <InputWrapper>
                        <StyledSelect value={gender} onChange={(e) => setGender(e.target.value)} required disabled={isLoading}>
                            <option value="" disabled>-- Select Your Gender --</option>
                            <option value="male">Male</option><option value="female">Female</option>
                            <option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option>
                        </StyledSelect>
                    </InputWrapper>
                </>
            )}
            
            <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading && <FiLoader size={18} className="spinner"/>}
                {isAwaitingOtp ? (isLoading ? 'Verifying...' : 'Verify & Sign Up') : (isLoading ? 'Sending Code...' : 'Continue')}
                {!isLoading && !isAwaitingOtp && <FiChevronRight size={20} />}
            </PrimaryButton>
        </FormContainer>

        <SocialLoginWrapper>
             <GoogleSignInButton
                callbackUrl={safeCallbackUrl}
                disabled={isLoading}
                setError={setError}
             />
        </SocialLoginWrapper>

        <SignInPrompt>
          Already have an account?
          <SignInLink onClick={() => !isLoading && router.push(`/auth/signin?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`)} disabled={isLoading}>
            Sign In
          </SignInLink>
        </SignInPrompt>
      </SignUpCard>
    </Container>
  );
}
