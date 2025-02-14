"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import debounce from "lodash.debounce";

import Logo from "./ui/Logo";

export default function SignUp() {
  const router = useRouter();
  const { theme } = useTheme();

  // Form steps state
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState("");

  // Form data state
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  useEffect(() => {
    if (currentStep === 4 && !isOtpSent) {
      sendOTP();
    }
  }, [currentStep]);
  

  // Add debounced tag check
  const checkTagAvailability = debounce(async (tag: string) => {
    if (!tag.match(/^@[a-zA-Z0-9_]{3,20}$/)) {
      setTagAvailable(null);
      return;
    }

    setCheckingTag(true);
    try {
      const response = await fetch("/api/check-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      });

      const data = await response.json();
      setTagAvailable(data.available);
      setTagSuggestions(data.suggestions || []);
    } catch (err) {
      setError("Failed to check tag availability");
    } finally {
      setCheckingTag(false);
    }
  }, 500);

  const sendOTP = async () => {
    setIsSendingOtp(true);
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) throw new Error("Failed to send OTP");
      setIsOtpSent(true);
      setOtpTimer(60); // start a 60-second countdown
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          !(userName && userTag && email && password && confirmPassword && tagAvailable) &&
          password === confirmPassword
        );
      case 1:
        return !userType;
      case 2:
        return false; 
      case 3:
        return false;
      case 4:
        return otp === ""; // OTP must be entered
      default:
        return true;
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
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
    if (validateStep(currentStep)) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
  
    const nextStep = currentStep + 1;
    if (nextStep > 4) {
      handleSignUp();
      return;
    }
    setCurrentStep(nextStep);
  };
  

  const handlePreviousStep = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep >= 0 ? prevStep : 0);
  };

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const addCredential = () => {
    if (newCredential.trim()) {
      setCredentials([...credentials, newCredential.trim()]);
      setNewCredential("");
    }
  };

  const handleSignUp = async () => {
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
          tags,
          credentials,
          bio,
          ...(userType !== "student" && { bio, tags, credentials }),
          ...(profileImage && { profileImage }),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");

      router.push("/auth/signin");
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 font-sans ${
        isDarkTheme
          ? "bg-gradient-to-br from-[#373e47] to-[#2f343f] text-[#d3dae3]"
          : "bg-gradient-to-br from-[#ffffff] to-[#f0f4f8] text-[#4b5162]"
      }`}
    >
      <div className="w-full max-w-md">
        <div
          className={`shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 transition-all duration-300 ${
            isDarkTheme ? "bg-[#2f343f] text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === 4) {
                handleSignUp();
              }
            }}
          >
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* The sliding container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentStep * 100}%)` }}
              >
                {/* Step 0 - Basic Info */}
                <div className="w-full flex-shrink-0">
                  <div className="mb-4">
                    <input
                      className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                        isDarkTheme
                          ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                          : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                      }`}
                      type="text"
                      placeholder="Full Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                        isDarkTheme
                          ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                          : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                      }`}
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                        isDarkTheme
                          ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                          : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                      }`}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <input
                      className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                        isDarkTheme
                          ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                          : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                      }`}
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                          isDarkTheme
                            ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                            : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                        } ${
                          tagAvailable === false
                            ? "border-red-500"
                            : tagAvailable
                            ? "border-green-500"
                            : ""
                        }`}
                        type="text"
                        placeholder="@username"
                        value={userTag}
                        onChange={(e) => {
                          setUserTag(e.target.value);
                          checkTagAvailability(e.target.value);
                        }}
                      />
                      {checkingTag && (
                        <div className="absolute right-3 top-2.5">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                      {tagAvailable && !checkingTag && (
                        <div className="absolute right-3 top-2.5 text-green-500">✓</div>
                      )}
                    </div>
                    {userTag && !tagAvailable && (
                      <div className="mt-2 text-sm text-red-500">
                        {tagSuggestions.length > 0 ? (
                          <>
                            Tag taken. Suggestions:
                            <div className="flex flex-wrap gap-2 mt-1">
                              {tagSuggestions.map((suggestion) => (
                                <button
                                  type="button"
                                  key={suggestion}
                                  onClick={() => {
                                    setUserTag(suggestion);
                                    checkTagAvailability(suggestion);
                                  }}
                                  className={`px-2 py-1 rounded-full text-sm ${
                                    isDarkTheme
                                      ? "bg-[#373e47] hover:bg-[#444c56]"
                                      : "bg-gray-200 hover:bg-gray-300"
                                  }`}
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </>
                        ) : (
                          "This tag is already taken"
                        )}
                      </div>
                    )}
                    {userTag && !userTag.match(/^@[a-zA-Z0-9_]{3,20}$/) && (
                      <div className="mt-2 text-sm text-red-500">
                        Must start with @ and contain 3-20 letters, numbers, or underscores
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 1 - User Type */}
                <div className="w-full flex-shrink-0">
                  <label>Select Gender:</label>
                  <div className="mb-4">
                    <select
                      className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent ${
                        isDarkTheme
                          ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                          : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                      }`}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <div className="flex flex-col gap-3">
                      <label>Select Role:</label>
                      {["student", "creator", "institution"].map((type) => (
                        <label
                          key={type}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors duration-300 ${
                            userType === type
                              ? isDarkTheme
                                ? "border-[#5294e2] bg-[#373e47]"
                                : "border-[#3367d6] bg-[#f0f4f8]"
                              : isDarkTheme
                              ? "border-[#373e47] hover:border-[#5294e2]"
                              : "border-gray-200 hover:border-[#3367d6]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="userType"
                            value={type}
                            checked={userType === type}
                            onChange={(e) => setUserType(e.target.value)}
                            className="form-radio h-5 w-5"
                          />
                          <span className="capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step 2 - Additional Info */}
                {["student", "creator", "institution"].includes(userType) && (
                  <div className="w-full flex-shrink-0">
                    <div className="mb-4">
                      <textarea
                        className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                          isDarkTheme
                            ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                            : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                        }`}
                        placeholder="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="mb-4">
                      <div className="flex gap-2 mb-2">
                        <input
                          className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                            isDarkTheme
                              ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                              : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                          }`}
                          type="text"
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
                            isDarkTheme
                              ? "text-[#5294e2] hover:bg-[#5294e2]"
                              : "text-[#3367d6] hover:bg-[#3367d6]"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <div
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                              isDarkTheme ? "bg-[#373e47] text-white" : "bg-gray-200 text-black"
                            }`}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => setTags(tags.filter((_, i) => i !== index))}
                              className="hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="flex gap-2 mb-2">
                        <input
                          className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                            isDarkTheme
                              ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                              : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                          }`}
                          type="text"
                          placeholder="Add credential"
                          value={newCredential}
                          onChange={(e) => setNewCredential(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={addCredential}
                          className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
                            isDarkTheme
                              ? "text-[#5294e2] hover:bg-[#5294e2]"
                              : "text-[#3367d6] hover:bg-[#3367d6]"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {credentials.map((credential, index) => (
                          <div
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                              isDarkTheme ? "bg-[#373e47] text-white" : "bg-gray-200 text-black"
                            }`}
                          >
                            {credential}
                            <button
                              type="button"
                              onClick={() => setCredentials(credentials.filter((_, i) => i !== index))}
                              className="hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 - Profile Picture (Optional) */}
                <div className="w-full flex-shrink-0">
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-white" : "text-black"}`}>
                      Profile Picture (Optional)
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Image URL (optional)"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                          isDarkTheme
                            ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                            : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-4 py-2 rounded flex items-center gap-2 ${
                          isDarkTheme
                            ? "bg-[#5294e2] hover:bg-[#4a84c9] text-white"
                            : "bg-[#3367d6] hover:bg-[#2851a3] text-white"
                        }`}
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                      />
                    </div>
                    {profileImage && (
                      <div className="mt-4 flex justify-center">
                        <img
                          src={profileImage}
                          alt="Profile preview"
                          className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      You can skip this step if you don't want to add a profile picture now.
                    </div>
                  </div>
                </div>

                {/* Step 4 - OTP Verification */}
                <div className="w-full flex-shrink-0">
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? "text-white" : "text-black"}`}>
                      Enter OTP sent to {email}
                    </label>
                    <input
                      className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                        isDarkTheme
                          ? "bg-[#373e47] text-white focus:ring-[#5294e2]"
                          : "bg-[#f0f4f8] text-black focus:ring-[#3367d6]"
                      }`}
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                    <button
                      type="button"
                      onClick={sendOTP}
                      className={`mt-2 text-sm ${
                        isDarkTheme
                          ? "text-[#5294e2] hover:text-[#4a84c9]"
                          : "text-[#3367d6] hover:text-[#2851a3]"
                      }`}
                      disabled={isSendingOtp || otpTimer > 0}
                    >
                      {isSendingOtp 
                        ? "Sending OTP..." 
                        : otpTimer > 0 
                          ? `Resend OTP in ${otpTimer}s` 
                          : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className={`font-bold py-2 px-4 rounded focus:outline-none transition-colors duration-300 ${
                    isDarkTheme
                      ? "text-[#5294e2] hover:text-[#4a84c9]"
                      : "text-[#3367d6] hover:text-[#2851a3]"
                  }`}
                >
                  Previous
                </button>
              )}
              <button
                type={"button"}
                onClick={handleNextStep}
                className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform duration-300 ease-in-out transform hover:scale-105 ${
                  isDarkTheme
                    ? "bg-[#5294e2] hover:bg-[#4a84c9] text-white"
                    : "bg-[#3367d6] hover:bg-[#2851a3] text-white"
                }`}
              >
                {currentStep === 4 ? "Sign Up" : "Next"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?
              <button
                className={`font-bold ml-1 transition-colors duration-300 ${
                  isDarkTheme
                    ? "text-[#5294e2] hover:text-[#4a84c9]"
                    : "text-[#3367d6] hover:text-[#2851a3]"
                }`}
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
