"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import styled, { css } from "styled-components";
import debounce from "lodash.debounce";
import { FiMail, FiLock, FiUser, FiTag, FiEye, FiEyeOff, FiCheck, FiLoader, FiPlus, FiX, FiUpload, FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Add necessary icons

// --- Assuming shared components & styles ---
import Logo from "./ui/Logo";
import { gradientShift } from "./ui/animations"; // Assuming shared animation

// --- Styled Components (Adapted from SignIn and extended for SignUp) ---

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
  padding: 1.5rem 2rem; /* Slightly less vertical padding for longer form */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px; /* Slightly wider for multi-step */
  position: relative;
  z-index: 1;
  border: 1px solid var(--card-border-color, rgba(255, 255, 255, 0.2));
  backdrop-filter: blur(10px);

  .dark & {
    --card-bg: rgba(41, 46, 57, 0.5);
    --card-border-color: rgba(56, 189, 248, 0.15);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.3), 0 0 15px var(--neon-glow-1, #22d3ee);
  }

  @media (max-width: 520px) {
    padding: 1rem 1.5rem;
    max-width: 95%;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem; /* Adjusted margin */
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
  margin-bottom: 1.5rem; /* Adjusted margin */
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

const StepsContainer = styled.div`
    overflow: hidden;
    position: relative;
    width: 100%;
    margin-bottom: 1.5rem;
`;

const StepSlider = styled.div<{ currentStep: number }>`
    display: flex;
    width: 500%; /* 100% * number of steps (5) */
    transition: transform 0.4s ease-in-out;
    transform: translateX(-${({ currentStep }) => currentStep * 20}%); /* 100 / 5 steps */
`;

const Step = styled.div`
    width: 20%; /* 100 / 5 steps */
    flex-shrink: 0;
    padding: 0 4px; /* Small padding between steps */
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem; /* Consistent margin */
`;

const InputIcon = styled.div<{ right?: boolean }>`
  position: absolute;
  ${({ right }) => (right ? 'right: 12px;' : 'left: 12px;')}
  top: 50%;
  transform: translateY(-50%);
  color: var(--input-icon-color, var(--text-secondary));
  opacity: 0.7;
  pointer-events: none;
  z-index: 2; /* Ensure icon is above input content */

  /* Spinner specific style */
  &.spinner svg {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }
`;

const BaseInputStyles = css`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem; /* Default padding for left icon */
  border: 1px solid var(--input-border-color, var(--color-slate-300));
  border-radius: 8px;
  background-color: var(--input-bg-color, var(--color-slate-50));
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  &::placeholder {
    color: var(--input-placeholder-color, var(--text-secondary));
    opacity: 0.8;
  }

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

  /* Error state */
  &.error {
      border-color: var(--error-color, #ef4444);
      &:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2); /* Red focus ring */
      }
      .dark & {
          border-color: var(--error-color, #f87171);
          &:focus {
              box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.25);
          }
      }
  }
    /* Success state */
  &.success {
      border-color: var(--success-color, #22c55e); /* Green */
       &:focus {
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); /* Green focus ring */
      }
      .dark & {
          border-color: var(--success-color-dark, #4ade80); /* Lighter Green */
          &:focus {
              box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25);
          }
      }
  }

  /* Style for inputs with right-side elements (like password toggle or tag status) */
  &.has-right-element {
    padding-right: 2.8rem; /* Make space for the element */
  }


  /* Theme-specific variables */
  .dark & {
    --input-border-color: rgba(148, 163, 184, 0.3);
    --input-bg-color: rgba(51, 65, 85, 0.6);
    --input-icon-color: var(--text-secondary);
    --input-placeholder-color: rgba(148, 163, 184, 0.6);
    --focus-ring-color: #22d3ee;
    --focus-ring-shadow: rgba(34, 211, 238, 0.25);
    --input-disabled-bg: rgba(51, 65, 85, 0.4);
  }
`;

const StyledInput = styled.input`
  ${BaseInputStyles}
`;

const StyledTextarea = styled.textarea`
  ${BaseInputStyles}
  padding-top: 0.75rem; /* Adjust vertical padding for textarea */
  padding-bottom: 0.75rem;
  min-height: 80px; /* Example height */
  resize: vertical;
`;

const StyledSelect = styled.select`
  ${BaseInputStyles}
  appearance: none; /* Remove default arrow */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.7rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  padding-right: 2.5rem; /* Make space for custom arrow */

  .dark & {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
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
  z-index: 3; // Above input

  &:hover { opacity: 1; }
  &:focus {
      outline: none;
      opacity: 1;
      box-shadow: 0 0 0 2px var(--focus-ring-shadow);
      border-radius: 4px;
   }
   svg { width: 18px; height: 18px; }
`;

const InputFeedbackIcon = styled(InputIcon)`
    pointer-events: none; /* Make it non-interactive */
    color: ${({ color }) => color || 'inherit'}; // Allow setting color directly
    opacity: 1;
`;

const HelperText = styled.div`
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 0.3rem;
    padding-left: 0.2rem;

    &.error {
        color: var(--error-color, #ef4444);
        .dark & { color: var(--error-color, #f87171); }
    }
     &.success {
        color: var(--success-color, #16a34a); /* Darker green for text */
        .dark & { color: var(--success-color-dark, #4ade80); }
    }
`;

const SuggestionButton = styled.button`
    background: var(--suggestion-bg, rgba(0, 0, 0, 0.05));
    color: var(--suggestion-text, var(--text-secondary));
    border: 1px solid var(--suggestion-border, rgba(0, 0, 0, 0.1));
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    margin: 0.2rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: var(--suggestion-hover-bg, rgba(0, 0, 0, 0.1));
        border-color: var(--suggestion-hover-border, rgba(0, 0, 0, 0.2));
    }

    .dark & {
        --suggestion-bg: rgba(255, 255, 255, 0.1);
        --suggestion-text: var(--text-secondary);
        --suggestion-border: rgba(255, 255, 255, 0.15);
        --suggestion-hover-bg: rgba(255, 255, 255, 0.15);
        --suggestion-hover-border: rgba(255, 255, 255, 0.2);
    }
`;

// --- Step Specific Components ---

const FieldLabel = styled.label`
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
`;

const RadioCardLabel = styled.label<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid var(--input-border-color, var(--color-slate-300));
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ isActive }) => isActive ? 'var(--radio-active-bg, rgba(59, 130, 246, 0.1))' : 'var(--input-bg-color, var(--color-slate-50))'};
  border-color: ${({ isActive }) => isActive ? 'var(--focus-ring-color, #3b82f6)' : 'var(--input-border-color, var(--color-slate-300))'};

  &:hover {
      border-color: var(--focus-ring-color, #3b82f6);
  }

  input[type="radio"] {
      margin-right: 0.75rem;
      appearance: none; /* Hide default radio */
      width: 18px; height: 18px;
      border: 2px solid var(--radio-border-color, var(--color-slate-400));
      border-radius: 50%;
      transition: all 0.2s ease;
      position: relative; /* For inner dot */

      &:checked {
          border-color: var(--focus-ring-color, #3b82f6);
          background-color: var(--focus-ring-color, #3b82f6);
          &::after { /* Inner dot */
              content: '';
              display: block;
              width: 8px; height: 8px;
              border-radius: 50%;
              background-color: var(--card-bg, white); /* Contrasting dot */
              position: absolute;
              top: 50%; left: 50%;
              transform: translate(-50%, -50%);
          }
      }
  }

  .dark & {
      border-color: ${({ isActive }) => isActive ? 'var(--focus-ring-color, #22d3ee)' : 'var(--input-border-color)'};
      background-color: ${({ isActive }) => isActive ? 'var(--radio-active-bg-dark, rgba(34, 211, 238, 0.15))' : 'var(--input-bg-color)'};
       --radio-border-color: rgba(148, 163, 184, 0.6);

      &:hover {
          border-color: var(--focus-ring-color, #22d3ee);
      }

      input[type="radio"] {
           &:checked {
              border-color: var(--focus-ring-color, #22d3ee);
              background-color: var(--focus-ring-color, #22d3ee);
               &::after {
                   background-color: var(--card-bg, #292e39); /* Dark contrasting dot */
               }
          }
      }
  }
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: var(--chip-bg, rgba(0, 0, 0, 0.05));
  color: var(--chip-text, var(--text-secondary));
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  margin: 0.2rem;
  border: 1px solid var(--chip-border, rgba(0, 0, 0, 0.1));

  button {
      background: none;
      border: none;
      color: inherit;
      opacity: 0.6;
      margin-left: 0.4rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      &:hover { opacity: 1; color: var(--error-color, #ef4444); }
  }

  .dark & {
      --chip-bg: rgba(255, 255, 255, 0.1);
      --chip-border: rgba(255, 255, 255, 0.15);
      --chip-text: var(--text-secondary);
      button:hover { color: var(--error-color, #f87171); }
  }
`;

const AddItemWrapper = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

const AddItemButton = styled.button`
    background: none;
    border: 1px solid var(--input-border-color, var(--color-slate-300));
    color: var(--link-color, #3b82f6);
    border-radius: 50%;
    width: 38px; /* Match input height */
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0; /* Prevent shrinking */

    &:hover {
        background-color: var(--button-hover-bg, rgba(59, 130, 246, 0.1));
        border-color: var(--link-color, #3b82f6);
    }
    &:disabled { cursor: not-allowed; opacity: 0.5; }

    .dark & {
        border-color: var(--input-border-color);
        color: var(--link-color, #5eead4);
         &:hover {
            background-color: var(--button-hover-bg-dark, rgba(94, 234, 212, 0.1));
            border-color: var(--link-color, #5eead4);
         }
    }
`;

const ProfilePreview = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--input-border-color, var(--color-slate-300));
    margin: 0 auto 1rem; /* Center and add margin */

    .dark & {
        border-color: var(--input-border-color);
    }
`;

const FileUploadWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const UploadButton = styled.button`
  /* Style like a secondary button */
  padding: 0.6rem 1rem;
  font-weight: 500;
  font-size: 0.9rem;
  border: 1px solid var(--button-secondary-border, #3b82f6);
  color: var(--button-secondary-text, #3b82f6);
  background-color: var(--button-secondary-bg, transparent);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
      background-color: var(--button-secondary-hover-bg, rgba(59, 130, 246, 0.1));
  }
  &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
  }

  .dark & {
    --button-secondary-border: #5eead4;
    --button-secondary-text: #5eead4;
    --button-secondary-hover-bg: rgba(94, 234, 212, 0.1);
  }
`;

// --- Action Buttons ---

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between; /* Push buttons apart */
  align-items: center;
  margin-top: 1.5rem; /* Space above buttons */
  padding-top: 1rem; /* Add space after form fields */
  border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));

  .dark & {
      --divider-color: rgba(255, 255, 255, 0.1);
  }
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
  display: inline-flex; /* Align icon and text */
  align-items: center;
  gap: 0.5rem; /* Space between icon and text */

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
      box-shadow: 0 0 0 3px var(--focus-ring-shadow);
  }

  &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
       background: var(--button-disabled-bg, #a0aec0);
       box-shadow: none;
       transform: none;
       filter: none;
  }

  .dark & {
     --button-grad-start: #22d3ee;
     --button-grad-end: #a78bfa;
     color: #0f172a;
     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
     &:disabled {
         background: var(--button-disabled-bg-dark, #4a5568);
         color: #a0aec0;
     }
  }
`;


const SecondaryButton = styled.button`
  padding: 0.7rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid var(--button-secondary-border, var(--link-color, #3b82f6));
  color: var(--button-secondary-text, var(--link-color, #3b82f6));
  background-color: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex; /* Align icon and text */
  align-items: center;
  gap: 0.5rem; /* Space between icon and text */

  &:hover:not(:disabled) {
      background-color: var(--button-secondary-hover-bg, rgba(59, 130, 246, 0.1));
  }
  &:active:not(:disabled) {
      background-color: var(--button-secondary-active-bg, rgba(59, 130, 246, 0.15));
  }
   &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px var(--focus-ring-shadow);
  }
  &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      border-color: var(--text-secondary);
      color: var(--text-secondary);
      background-color: transparent;
  }

  .dark & {
    --button-secondary-border: var(--link-color, #5eead4);
    --button-secondary-text: var(--link-color, #5eead4);
    --button-secondary-hover-bg: rgba(94, 234, 212, 0.1);
    --button-secondary-active-bg: rgba(94, 234, 212, 0.15);
  }
`;


const SignInPrompt = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding-top: 1rem;
  margin-top: 0.5rem; /* Reduced margin */
`;

const SignInLink = styled.button`
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
     --link-color: #5eead4;
     --link-hover-color: #2dd4bf;
   }
`;

const ResendOtpButton = styled.button`
    background: none;
    border: none;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    padding: 0.2rem 0;
    cursor: pointer;
    color: var(--link-color, #3b82f6);
    transition: color 0.2s ease;

    &:hover:not(:disabled) {
        color: var(--link-hover-color, #2563eb);
    }
    &:disabled {
        color: var(--text-secondary);
        cursor: not-allowed;
    }

    .dark & {
      color: var(--link-color, #5eead4);
       &:hover:not(:disabled) { color: var(--link-hover-color, #2dd4bf); }
       &:disabled { color: var(--text-secondary); }
    }
`;


// --- Component Logic ---

export default function SignUp() {
  const router = useRouter();
  const { resolvedTheme } = useTheme(); // Use resolvedTheme

  // Form steps state
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState("");

  // Form data state
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [credentials, setCredentials] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [newCredential, setNewCredential] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userTag, setUserTag] = useState("");
  const [tagAvailable, setTagAvailable] = useState<boolean | null>(null);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [checkingTag, setCheckingTag] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [gender, setGender] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // General loading state for submit


  // Set theme class on body (needed for .dark selector)
  useEffect(() => {
      document.body.classList.remove('dark', 'light');
      if (resolvedTheme) {
        document.body.classList.add(resolvedTheme);
      }
  }, [resolvedTheme]);

  // OTP Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Send OTP when step 4 is reached
   useEffect(() => {
    if (currentStep === 4 && !isOtpSent && email) { // Ensure email exists
      sendOTP();
    }
    // Clear error when step changes
    setError(null);
  }, [currentStep, email]); // Add email dependency


  const checkTagAvailability = debounce(async (tag: string) => {
    setTagSuggestions([]); // Clear old suggestions
    if (!tag.match(/^@[a-zA-Z0-9_]{3,20}$/)) {
      setTagAvailable(null);
      setCheckingTag(false); // Stop checking if format is invalid
      return;
    }

    setCheckingTag(true);
    setTagAvailable(null); // Reset availability status while checking
    try {
      const response = await fetch("/api/check-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Check failed');
      setTagAvailable(data.available);
      setTagSuggestions(data.suggestions || []);
    } catch (err: any) {
      console.error("Tag check error:", err);
      // Avoid setting form-wide error for this, maybe show inline
      setTagAvailable(null); // Indicate check failed
    } finally {
      setCheckingTag(false);
    }
  }, 500); // Debounce interval

  const sendOTP = async () => {
    if (!email || !email.includes('@')) {
        setError("Please enter a valid email address first.");
        return;
    }
    setError(null); // Clear previous errors
    setIsSendingOtp(true);
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP");

      setIsOtpSent(true);
      setOtpTimer(60); // start a 60-second countdown
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
      setIsOtpSent(false); // Ensure state reflects failure
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Basic validation per step (can be more sophisticated)
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!userName || !email || !userTag || !password || !confirmPassword) return false;
        if (!email.includes('@')) return false; // Basic email check
        if (!userTag.match(/^@[a-zA-Z0-9_]{3,20}$/)) return false;
        if (tagAvailable === false || checkingTag) return false; // Tag must be available and not checking
        if (password !== confirmPassword) return false;
        if (password.length < 6) return false; // Example password length
        return true;
      case 1:
        return !!userType && !!gender;
      case 2: // Optional Step (Bio/Tags/Creds) - Always allow next
        return true;
      case 3: // Optional Step (Profile Pic) - Always allow next
        return true;
      case 4:
        return otp.length === 6; // OTP must be 6 digits
      default:
        return false;
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      setProfileImage(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
        // Optionally set a specific error message based on the step
         if (currentStep === 0 && password !== confirmPassword) {
            setError("Passwords do not match.");
        } else if (currentStep === 0 && password.length < 6) {
             setError("Password must be at least 6 characters long.");
        } else if (currentStep === 0 && tagAvailable === false) {
             setError("Username tag is already taken or invalid.");
        }
         else {
             setError("Please complete all required fields correctly.");
         }
      return;
    }
    setError(null);
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
     setError(null); // Clear error when going back
     setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const addCredential = () => {
     const trimmedCredential = newCredential.trim();
    if (trimmedCredential && !credentials.includes(trimmedCredential)) {
      setCredentials([...credentials, trimmedCredential]);
      setNewCredential("");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent default form submission
      if (!validateStep(4)) {
        setError("Please enter the 6-digit OTP.");
        return;
      }

      setError(null);
      setIsLoading(true);
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userTag,
            otp,
            gender,
            password,
            userName,
            user_type: userType,
            bio,
            tags,
            credentials,
            profileImage: profileImage || null, // Send null if empty
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Something went wrong.");

        // Optionally show success message before redirecting
        router.push("/auth/signin?signup=success"); // Redirect to sign in with success indication
      } catch (err: any) {
        setError(err.message || "Failed to sign up.");
      } finally {
        setIsLoading(false);
      }
  };

  const getTagInputClass = () => {
      if (checkingTag || !userTag) return '';
      if (!userTag.match(/^@[a-zA-Z0-9_]{3,20}$/)) return 'error';
      return tagAvailable ? 'success' : 'error';
  }

  return (
    <Container>
      <SignUpCard>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <Title>Create Account</Title>
        <Subtitle>Join the Lumo community</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormContainer onSubmit={handleSignUp}>
          <StepsContainer>
            <StepSlider currentStep={currentStep}>
              {/* --- Step 0: Basic Info --- */}
              <Step>
                 <InputWrapper>
                    <InputIcon><FiUser size={18} /></InputIcon>
                    <StyledInput
                      type="text"
                      placeholder="Full Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <InputIcon><FiMail size={18} /></InputIcon>
                    <StyledInput
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading || isSendingOtp || currentStep === 4} // Disable if sending OTP or on OTP step
                    />
                  </InputWrapper>
                   <InputWrapper>
                    <InputIcon><FiTag size={18} /></InputIcon>
                    <StyledInput
                      type="text"
                      placeholder="@username (e.g., @jane_doe)"
                      value={userTag}
                      onChange={(e) => {
                        const tag = e.target.value;
                        setUserTag(tag);
                        // Trigger check only if format looks potentially valid or empty
                        if (tag === '' || tag.startsWith('@')) {
                            checkTagAvailability(tag);
                        } else {
                             setTagAvailable(null); // Reset if format is wrong (e.g., no @)
                             setCheckingTag(false);
                        }
                      }}
                      required
                      disabled={isLoading}
                      className={`${getTagInputClass()} ${checkingTag || (tagAvailable !== null && userTag.length > 0) ? 'has-right-element' : ''}`} // Add class if icon needed
                    />
                    {checkingTag && <InputFeedbackIcon right className="spinner"><FiLoader size={18} /></InputFeedbackIcon>}
                    {!checkingTag && tagAvailable === true && userTag.length > 0 && <InputFeedbackIcon right color="var(--success-color, #22c55e)"><FiCheck size={18} /></InputFeedbackIcon>}
                     {/* No icon shown for error state, handled by border and helper text */}
                    {userTag && !checkingTag && tagAvailable === false && (
                        <HelperText className="error">
                        Tag unavailable. Suggestions: {' '}
                        {tagSuggestions.length > 0
                            ? tagSuggestions.map((suggestion) => (
                                <SuggestionButton
                                type="button"
                                key={suggestion}
                                onClick={() => {
                                    setUserTag(suggestion);
                                    checkTagAvailability(suggestion); // Re-check suggestion
                                }}
                                >
                                {suggestion}
                                </SuggestionButton>
                            ))
                            : "No suggestions available."}
                        </HelperText>
                    )}
                    {userTag && !userTag.match(/^@[a-zA-Z0-9_]{3,20}$/) && (
                      <HelperText className="error">
                        Use 3-20 letters, numbers, or underscores, starting with @.
                      </HelperText>
                    )}
                  </InputWrapper>
                  <InputWrapper>
                    <InputIcon><FiLock size={18} /></InputIcon>
                    <StyledInput
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isLoading}
                      className={password.length > 0 && password.length < 6 ? 'error has-right-element' : 'has-right-element'}
                    />
                    <PasswordToggle
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        disabled={isLoading}
                    >
                        {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                    </PasswordToggle>
                      {password.length > 0 && password.length < 6 && (
                        <HelperText className="error">Password too short</HelperText>
                      )}
                  </InputWrapper>
                  <InputWrapper>
                    <InputIcon><FiLock size={18} /></InputIcon>
                    <StyledInput
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isLoading}
                      className={confirmPassword.length > 0 && password !== confirmPassword ? 'error has-right-element' : 'has-right-element'}
                    />
                     <PasswordToggle
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                        disabled={isLoading}
                    >
                        {showConfirmPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                    </PasswordToggle>
                     {confirmPassword.length > 0 && password !== confirmPassword && (
                        <HelperText className="error">Passwords do not match</HelperText>
                      )}
                  </InputWrapper>

              </Step>

              {/* --- Step 1: User Type & Gender --- */}
              <Step>
                  <FieldLabel>Select Gender</FieldLabel>
                   <InputWrapper>
                       {/* Icon isn't standard for select, omitting for now */}
                       <StyledSelect
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                            disabled={isLoading}
                        >
                            <option value="" disabled>-- Select Gender --</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                             <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </StyledSelect>
                   </InputWrapper>

                   <FieldLabel style={{ marginTop: '1.5rem' }}>Select Role</FieldLabel>
                   {["student", "creator", "institution"].map((type) => (
                       <RadioCardLabel key={type} isActive={userType === type}>
                            <input
                                type="radio"
                                name="userType"
                                value={type}
                                checked={userType === type}
                                onChange={(e) => setUserType(e.target.value)}
                                disabled={isLoading}
                            />
                            <span style={{ textTransform: 'capitalize' }}>{type}</span>
                       </RadioCardLabel>
                    ))}
              </Step>

              {/* --- Step 2: Additional Info --- */}
               <Step>
                    <FieldLabel>Bio (Optional)</FieldLabel>
                     <InputWrapper>
                         <StyledTextarea
                            placeholder="Tell us a bit about yourself or your institution..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            disabled={isLoading}
                         />
                    </InputWrapper>

                    <FieldLabel>Tags (Optional)</FieldLabel>
                    <InputWrapper>
                         <AddItemWrapper>
                             <StyledInput
                                type="text"
                                placeholder="Add a tag (e.g., 'Physics', 'Art')"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                                disabled={isLoading}
                              />
                             <AddItemButton type="button" onClick={addTag} disabled={!newTag.trim() || isLoading}>
                                <FiPlus size={20} />
                             </AddItemButton>
                         </AddItemWrapper>
                         <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap' }}>
                            {tags.map((tag, index) => (
                            <Chip key={index}>
                                {tag}
                                <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== index))} disabled={isLoading}>
                                    <FiX size={14}/>
                                </button>
                            </Chip>
                            ))}
                        </div>
                    </InputWrapper>


                    <FieldLabel>Credentials (Optional)</FieldLabel>
                     <InputWrapper>
                         <AddItemWrapper>
                             <StyledInput
                                type="text"
                                placeholder="Add a credential (e.g., 'PhD', 'Certified Coach')"
                                value={newCredential}
                                onChange={(e) => setNewCredential(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCredential(); }}}
                                disabled={isLoading}
                              />
                             <AddItemButton type="button" onClick={addCredential} disabled={!newCredential.trim() || isLoading}>
                                <FiPlus size={20} />
                             </AddItemButton>
                         </AddItemWrapper>
                         <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap' }}>
                            {credentials.map((credential, index) => (
                                <Chip key={index}>
                                    {credential}
                                    <button type="button" onClick={() => setCredentials(credentials.filter((_, i) => i !== index))} disabled={isLoading}>
                                        <FiX size={14}/>
                                    </button>
                                </Chip>
                            ))}
                         </div>
                    </InputWrapper>
               </Step>

              {/* --- Step 3: Profile Picture --- */}
               <Step>
                    <FieldLabel>Profile Picture (Optional)</FieldLabel>
                    {profileImage && <ProfilePreview src={profileImage} alt="Profile preview" />}

                    <FileUploadWrapper>
                         <InputWrapper style={{ flexGrow: 1, marginBottom: 0 }}>
                           <InputIcon><FiImage size={18}/></InputIcon>
                            <StyledInput
                                type="text"
                                placeholder="Enter Image URL or Upload"
                                value={profileImage}
                                onChange={(e) => setProfileImage(e.target.value)}
                                disabled={isLoading || isUploading}
                             />
                         </InputWrapper>
                         <UploadButton
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || isLoading}
                          >
                            {isUploading ? <><FiLoader size={18} className="spinner"/> Uploading...</> : <><FiUpload size={18}/> Upload</>}
                         </UploadButton>
                         <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                            }}
                            style={{ display: 'none' }} // Hide the actual file input
                            disabled={isUploading || isLoading}
                         />
                     </FileUploadWrapper>
                     <HelperText style={{ marginTop: '1rem', textAlign: 'center' }}>
                         You can skip this and add a picture later.
                     </HelperText>
               </Step>

              {/* --- Step 4: OTP Verification --- */}
              <Step>
                 <FieldLabel>Verify Your Email</FieldLabel>
                 <HelperText style={{ marginBottom: '1rem' }}>
                    Enter the 6-digit code sent to <strong>{email}</strong>.
                 </HelperText>
                 <InputWrapper>
                    {/* No specific icon for OTP, maybe a generic code icon if desired */}
                    <StyledInput
                        type="text" // Use text to allow easier input handling
                        placeholder="------" // Placeholder indicating 6 digits
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} // Allow only digits, max 6
                        required
                        maxLength={6}
                        disabled={isLoading}
                        style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem' }} // Style for OTP look
                     />
                </InputWrapper>
                 <ResendOtpButton
                    type="button"
                    onClick={sendOTP}
                    disabled={isSendingOtp || otpTimer > 0 || isLoading}
                 >
                    {isSendingOtp
                        ? "Sending OTP..."
                        : otpTimer > 0
                        ? `Resend OTP in ${otpTimer}s`
                        : "Resend OTP"}
                 </ResendOtpButton>
              </Step>

            </StepSlider>
          </StepsContainer>

          {/* --- Navigation --- */}
          <ActionsWrapper>
             <SecondaryButton
                type="button"
                onClick={handlePreviousStep}
                disabled={currentStep === 0 || isLoading}
              >
                <FiChevronLeft size={20} /> Previous
             </SecondaryButton>

            {currentStep < 4 ? (
                 <PrimaryButton
                    type="button"
                    onClick={handleNextStep}
                    disabled={!validateStep(currentStep) || isLoading}
                  >
                     Next <FiChevronRight size={20} />
                 </PrimaryButton>
            ) : (
                <PrimaryButton
                    type="submit" // Change to submit on the last step
                    disabled={!validateStep(currentStep) || isLoading || isSendingOtp}
                >
                    {isLoading ? <><FiLoader size={18} className="spinner"/> Signing Up...</> : "Sign Up"}
                </PrimaryButton>
            )}

          </ActionsWrapper>
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