"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import apiService from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";

export default function RegisterPage() {
  const { loginUser } = useShop();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Google Auth states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [useCustomGoogleEmail, setUseCustomGoogleEmail] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [googleLoginError, setGoogleLoginError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtpScreen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showOtpScreen, timer]);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Handle Real Google Sign-in Callback
  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true);
    setGoogleLoginError("");
    setError("");
    try {
      const idToken = response.credential;
      
      const data = await apiService.auth.googleLogin(undefined, undefined, undefined, idToken);
      setLoading(false);
      
      loginUser(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        data.token
      );
      
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
    } catch (err: any) {
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || "Google Sign-In failed. Please try again.";
      setGoogleLoginError(errMsg);
      setError(errMsg);
    }
  };

  // Initialize Real Google Sign-In if client ID is set
  useEffect(() => {
    if (!googleClientId || showOtpScreen) return;

    const initializeGoogle = () => {
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        try {
          google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
          });
          
          const btnContainer = document.getElementById("google-signin-button");
          if (btnContainer) {
            google.accounts.id.renderButton(btnContainer, {
              theme: "outline",
              size: "large",
              width: btnContainer.clientWidth || 380,
              text: "continue_with",
              shape: "rectangular",
            });
          }
        } catch (initErr) {
          console.error("Failed to initialize Google Identity Services:", initErr);
        }
      }
    };

    const timeout = setTimeout(() => {
      const google = (window as any).google;
      if (google) {
        initializeGoogle();
      } else {
        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (script) {
          script.addEventListener("load", initializeGoogle);
        }
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [googleClientId, showOtpScreen]);

  // Handle Details Form Submission (Step 1: Send OTP)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiService.auth.sendOtp(email);
      setLoading(false);
      setShowOtpScreen(true);
      setTimer(60);
    } catch (err: any) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to send OTP. Please check your network and try again."
      );
    }
  };

  // Handle Verify & Register Submission (Step 2: Verify OTP)
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpValues.join("");
    if (enteredOtp.length < 6) {
      setOtpError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      const data = await apiService.auth.register(name, email, password, enteredOtp);
      setLoading(false);
      loginUser(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        data.token
      );
      
      // Redirect depending on user privilege role
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
    } catch (err: any) {
      setLoading(false);
      setOtpError(
        err.response?.data?.message ||
        err.message ||
        "Incorrect or expired OTP. Please try again."
      );
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0 || resendLoading) return;

    setResendLoading(true);
    setOtpError("");

    try {
      await apiService.auth.sendOtp(email);
      setResendLoading(false);
      setTimer(60);
      setOtpValues(new Array(6).fill(""));
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0]?.focus();
        }
      }, 50);
    } catch (err: any) {
      setResendLoading(false);
      setOtpError(err.response?.data?.message || err.message || "Failed to resend OTP.");
    }
  };

  // Handle Google Login Submit
  const handleGoogleLoginSubmit = async (gName: string, gEmail: string, gId: string) => {
    setLoading(true);
    setGoogleLoginError("");
    try {
      const data = await apiService.auth.googleLogin(gName, gEmail, gId);
      setLoading(false);
      setShowGoogleModal(false);
      loginUser(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        data.token
      );
      
      // Redirect depending on user privilege role
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
    } catch (err: any) {
      setLoading(false);
      setGoogleLoginError(
        err.response?.data?.message ||
        err.message ||
        "Google sign in failed. Please try again."
      );
    }
  };

  // Handle individual OTP input changes
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = val.substring(val.length - 1);
    setOtpValues(newOtpValues);

    // Auto-focus next box
    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const chars = pastedData.split("");
      setOtpValues(chars);
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-16 bg-brand-bg flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md px-4 sm:px-6">
          <div className="bg-white border border-brand-border/60 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {!showOtpScreen ? (
                /* Step 1: Details Registration Form */
                <motion.div
                  key="details-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h1 className="font-serif text-3xl font-bold text-brand-navy">Create Account</h1>
                    <p className="text-xs sm:text-sm text-brand-slate">Sign up to save items, track orders, and get 10% off.</p>
                  </div>

                  {error && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Diya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. diya@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Password</label>
                      <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-navy text-white font-semibold py-3.5 rounded-xl hover:bg-brand-navy/95 transition duration-200 text-sm shadow-sm flex items-center justify-center cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Send Verification OTP"
                      )}
                    </button>
                  </form>

                  {/* OR Divider */}
                  <div className="relative my-4 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-brand-border/40"></div>
                    </div>
                    <div className="relative bg-white px-4 text-[10px] font-bold uppercase tracking-wider text-brand-slate">
                      or
                    </div>
                  </div>

                  {/* Google Button Container */}
                  {googleClientId ? (
                    <div id="google-signin-button" className="w-full flex justify-center min-h-[44px]"></div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowGoogleModal(true)}
                      className="w-full border border-brand-border rounded-xl py-3 text-sm font-semibold text-brand-navy hover:bg-brand-bg/40 transition duration-200 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.21-3.2C17.57 1.7 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.27 7.54 8.9 5.04 12 5.04z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.43c-.28 1.44-1.1 2.66-2.33 3.49l3.62 2.81c2.12-1.95 3.34-4.83 3.34-8.4z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.36 14.5c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.82 0 10.96 0 13.2c0 2.24.54 4.38 1.5 6.3l3.86-3z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.62-2.81c-1.01.68-2.31 1.09-3.96 1.09-3.1 0-5.73-2.5-6.67-5.46L1.86 16.8c1.9 3.85 5.85 6.5 10.14 6.5z"
                        />
                      </svg>
                      Continue with Google (Mock)
                    </button>
                  )}

                  <div className="text-xs text-brand-slate text-center border-t border-brand-border/40 pt-4">
                    <p>Already have an account? <Link href="/login" className="text-brand-pink font-bold hover:underline">Login</Link></p>
                  </div>
                </motion.div>
              ) : (
                /* Step 2: OTP Verification Screen */
                <motion.div
                  key="otp-screen"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => {
                      setShowOtpScreen(false);
                      setOtpValues(new Array(6).fill(""));
                      setOtpError("");
                    }}
                    className="flex items-center text-xs text-brand-navy hover:text-brand-pink font-bold gap-1 transition cursor-pointer"
                  >
                    <FiArrowLeft className="w-3.5 h-3.5" /> Back to Edit Details
                  </button>

                  <div className="text-center space-y-2">
                    <h1 className="font-serif text-3xl font-bold text-brand-navy">Verify Email</h1>
                    <p className="text-xs sm:text-sm text-brand-slate">
                      We have sent a 6-digit OTP to your email: <br />
                      <strong className="text-brand-navy break-all font-semibold">{email}</strong>
                    </p>
                  </div>

                  {otpError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold text-center animate-pulse">
                      {otpError}
                    </div>
                  )}

                  <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                    {/* Digits Container */}
                    <div className="flex justify-between items-center gap-2">
                      {otpValues.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          ref={(el) => { inputRefs.current[idx] = el; }}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target, idx)}
                          onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                          onPaste={handleOtpPaste}
                          className="w-12 h-14 sm:w-14 sm:h-16 text-center border-2 border-brand-border focus:border-brand-pink text-xl font-bold rounded-2xl focus:outline-none bg-brand-bg/20 text-brand-navy transition-all focus:ring-1 focus:ring-brand-pink/50"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-navy text-white font-semibold py-3.5 rounded-xl hover:bg-brand-navy/95 transition duration-200 text-sm shadow-sm flex items-center justify-center cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Verify & Create Account"
                      )}
                    </button>
                  </form>

                  {/* Resend Option */}
                  <div className="text-xs text-brand-slate text-center pt-2">
                    {timer > 0 ? (
                      <p>Resend OTP code in <span className="text-brand-navy font-bold">{timer}s</span></p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendLoading}
                        className="text-brand-pink font-bold hover:underline flex items-center gap-1.5 mx-auto cursor-pointer"
                      >
                        {resendLoading ? (
                          <FiRefreshCw className="animate-spin w-3.5 h-3.5" />
                        ) : (
                          "Resend OTP Code"
                        )}
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-brand-slate text-center bg-brand-bg/30 p-2.5 rounded-xl border border-brand-border/40 italic">
                    Tip: If you don&apos;t receive the email, look at the <strong className="text-brand-navy font-semibold">backend server terminal log</strong>. The OTP code is printed there for easy debugging!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>

      {/* Google Mock Sign-in Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-brand-border/60 shadow-xl space-y-6 relative"
            >
              {/* Google Brand Header */}
              <div className="text-center space-y-2">
                <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.21-3.2C17.57 1.7 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.27 7.54 8.9 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.43c-.28 1.44-1.1 2.66-2.33 3.49l3.62 2.81c2.12-1.95 3.34-4.83 3.34-8.4z" />
                  <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.82 0 10.96 0 13.2c0 2.24.54 4.38 1.5 6.3l3.86-3z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.62-2.81c-1.01.68-2.31 1.09-3.96 1.09-3.1 0-5.73-2.5-6.67-5.46L1.86 16.8c1.9 3.85 5.85 6.5 10.14 6.5z" />
                </svg>
                <h2 className="font-sans text-xl font-bold text-gray-800">Sign in with Google</h2>
                <p className="text-xs sm:text-sm text-gray-500">to continue to <strong className="text-brand-navy">Niela</strong></p>
              </div>

              {googleLoginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold text-center animate-pulse">
                  {googleLoginError}
                </div>
              )}

              {/* Profiles Selector */}
              {!useCustomGoogleEmail ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Choose an account</p>
                  
                  {/* Diya Profile */}
                  <button
                    type="button"
                    onClick={() => handleGoogleLoginSubmit("Diya Sharma", "diyasharma@gmail.com", "google-111")}
                    className="w-full flex items-center gap-3 p-3.5 border border-brand-border/60 hover:bg-brand-bg/40 hover:border-brand-pink/50 rounded-2xl text-left transition duration-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center font-bold text-brand-pink text-sm uppercase">
                      DS
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy">Diya Sharma</p>
                      <p className="text-xs text-brand-slate">diyasharma@gmail.com</p>
                    </div>
                  </button>

                  {/* Aarav Profile */}
                  <button
                    type="button"
                    onClick={() => handleGoogleLoginSubmit("Aarav Patel", "aaravpatel@gmail.com", "google-222")}
                    className="w-full flex items-center gap-3 p-3.5 border border-brand-border/60 hover:bg-brand-bg/40 hover:border-brand-pink/50 rounded-2xl text-left transition duration-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center font-bold text-brand-navy text-sm uppercase">
                      AP
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy">Aarav Patel</p>
                      <p className="text-xs text-brand-slate">aaravpatel@gmail.com</p>
                    </div>
                  </button>

                  {/* Custom Email Toggle */}
                  <button
                    type="button"
                    onClick={() => setUseCustomGoogleEmail(true)}
                    className="w-full text-center py-2 text-xs font-bold text-brand-pink hover:underline cursor-pointer"
                  >
                    Use another account
                  </button>
                </div>
              ) : (
                /* Custom email form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customGoogleEmail.trim()) return;
                    const namePart = customGoogleEmail.split("@")[0];
                    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                    handleGoogleLoginSubmit(formattedName, customGoogleEmail, "google-custom");
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. test@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomGoogleEmail(false);
                        setCustomGoogleEmail("");
                        setGoogleLoginError("");
                      }}
                      className="w-1/2 border border-brand-border rounded-xl py-3 text-xs font-semibold text-brand-navy hover:bg-brand-bg/40 transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-brand-navy text-white rounded-xl py-3 text-xs font-semibold hover:bg-brand-navy/95 transition cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              )}

              {/* Developer Info Banner */}
              <div className="bg-brand-bg/60 border border-brand-border/40 p-3.5 rounded-2xl text-[10px] text-brand-slate space-y-1.5 italic">
                <p className="font-bold text-brand-navy not-italic">How to display your system's real accounts:</p>
                <p>To load real Google accounts logged into this PC, create an OAuth client ID for <strong>http://localhost:3000</strong> in your Google Console, then paste it in <strong>frontend/.env.local</strong> as:</p>
                <code className="block bg-white p-1.5 border border-brand-border/40 rounded-lg text-brand-pink font-mono text-[9px] break-all select-all">
                  NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
                </code>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setShowGoogleModal(false);
                  setUseCustomGoogleEmail(false);
                  setCustomGoogleEmail("");
                  setGoogleLoginError("");
                }}
                className="w-full text-center text-xs text-brand-slate hover:text-brand-pink transition duration-200 mt-2 cursor-pointer font-semibold"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
