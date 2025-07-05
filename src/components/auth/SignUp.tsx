// src/components/SignUp.tsx (or your path)
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import styled, { css } from "styled-components";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiChevronRight, FiUser } from 'react-icons/fi'; // Added FiUser

// --- Assuming shared components & styles ---
import Logo from "@/components/ui/Logo";
import { gradientShift } from "@/components/ui/animations";

// --- Styled Components (No changes needed here, using existing styles) ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
  background-size: 200% 200%;
  animation: ${gradientShift} 15s ease infinite;
  transition: background 0.5s ease;
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
    --card-bg: rgba(41, 46, 57, 0.5);
    --card-border-color: rgba(56, 189, 248, 0.15);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.3), 0 0 15px var(--neon-glow-1, #22d3ee);
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
  padding: 0.5rem 0.75rem;
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
  border: 1px solid var(--input-border-color, var(--color-slate-300));
  border-radius: 8px;
  background-color: var(--input-bg-color, var(--color-slate-50));
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

const ResendOtpButton = styled.button`
    background: none; border: none; font-size: 0.85rem; margin-top: 1rem; text-align: center; width: 100%;
    cursor: pointer; color: var(--link-color, #3b82f6);
    &:hover:not(:disabled) { text-decoration: underline; }
    &:disabled { color: var(--text-secondary); cursor: not-allowed; }
    .dark & { color: var(--link-color, #5eead4); }
`;

const SignInPrompt = styled.div`
  text-align: center; font-size: 0.9rem; color: var(--text-secondary);
  margin-top: 1.5rem; border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08)); padding-top: 1.5rem;
  .dark & { --divider-color: rgba(255, 255, 255, 0.1); }
`;

const SignInLink = styled.button`
   font-weight: 600; margin-left: 0.25rem; background: none; border: none;
   cursor: pointer; color: var(--link-color, #3b82f6);
   &:hover { color: var(--link-hover-color, #2563eb); }
   .dark & { --link-color: #5eead4; --link-hover-color: #2dd4bf; }
`;


export default function SignUp() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  // Updated State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [otp, setOtp] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isAwaitingOtp, setIsAwaitingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.remove('dark', 'light');
    if (resolvedTheme) {
      document.body.classList.add(resolvedTheme);
    }
  }, [resolvedTheme]);

  // OTP Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateInitialForm = (): boolean => {
    // Update validation to include names
    if (!firstName || !lastName || !email || !password || !confirmPassword || !gender) {
        setError("All fields are required.");
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address.");
        return false;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return false;
    }
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return false;
    }
    return true;
  }

  const handleSendOtp = async () => {
    if (!validateInitialForm()) return;
    
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP. The email might already be in use.");

      setIsAwaitingOtp(true);
      setOtpTimer(60); // Start 60-second countdown
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
      // Send names in the API call
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, gender, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");

      router.push("/auth/signin?signup=success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <SignUpCard>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <Title>{isAwaitingOtp ? 'Verify Your Email' : 'Create an Account'}</Title>
        <Subtitle>
            {isAwaitingOtp ? `Enter the 6-digit code sent to ${email}` : 'Join the Lumo community in a few clicks.'}
        </Subtitle>

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
                    {/* Add First Name and Last Name inputs */}
                    <InputWrapper>
                        <InputIcon><FiUser size={18} /></InputIcon>
                        <StyledInput
                            type="text" placeholder="First Name" value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} required disabled={isLoading}
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <InputIcon><FiUser size={18} /></InputIcon>
                        <StyledInput
                            type="text" placeholder="Last Name" value={lastName}
                            onChange={(e) => setLastName(e.target.value)} required disabled={isLoading}
                        />
                    </InputWrapper>

                    <InputWrapper>
                        <InputIcon><FiMail size={18} /></InputIcon>
                        <StyledInput
                            type="email" placeholder="Email Address" value={email}
                            onChange={(e) => setEmail(e.target.value)} required disabled={isLoading}
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <InputIcon><FiLock size={18} /></InputIcon>
                        <StyledInput
                            type={showPassword ? "text" : "password"} placeholder="Password (min. 6 characters)"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required minLength={6} disabled={isLoading} className="has-right-element"
                        />
                        <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                        </PasswordToggle>
                    </InputWrapper>
                    <InputWrapper>
                        <InputIcon><FiLock size={18} /></InputIcon>
                        <StyledInput
                            type="password" placeholder="Confirm Password" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} disabled={isLoading}
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <StyledSelect
                            value={gender} onChange={(e) => setGender(e.target.value)}
                            required disabled={isLoading}
                        >
                            <option value="" disabled>-- Select Your Gender --</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </StyledSelect>
                    </InputWrapper>
                </>
            )}
            
            <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? <FiLoader size={18} className="spinner"/> : null}
                {isAwaitingOtp 
                    ? (isLoading ? 'Verifying...' : 'Verify & Sign Up')
                    : (isLoading ? 'Sending Code...' : 'Continue')
                }
                {!isLoading && !isAwaitingOtp && <FiChevronRight size={20} />}
            </PrimaryButton>

            {isAwaitingOtp && (
                <ResendOtpButton type="button" onClick={handleSendOtp} disabled={isLoading || otpTimer > 0}>
                    {otpTimer > 0 ? `Resend code in ${otpTimer}s` : 'Resend Code'}
                </ResendOtpButton>
            )}
        </FormContainer>

        <SignInPrompt>
          Already have an account?
          <SignInLink onClick={() => !isLoading && router.push("/auth/signin")}>
            Sign In
          </SignInLink>
        </SignInPrompt>
      </SignUpCard>
    </Container>
  );
}