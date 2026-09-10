"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import apiService from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiRefreshCw, FiCheckCircle, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step 1: "request" | Step 2: "verify_reset" | Step 3: "success"
  const [step, setStep] = useState<"request" | "verify_reset" | "success">("request");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for Step 2
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "verify_reset" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await apiService.auth.forgotPassword(email.trim());
      setLoading(false);
      setStep("verify_reset");
      setTimer(60);
      setOtpValues(new Array(6).fill(""));
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0]?.focus();
        }
      }, 100);
    } catch (err: any) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to send reset code. Please check your email and try again."
      );
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0 || resendLoading) return;

    setResendLoading(true);
    setError("");

    try {
      await apiService.auth.forgotPassword(email.trim());
      setResendLoading(false);
      setTimer(60);
      setOtpValues(new Array(6).fill(""));
      setSuccessMsg("A new verification code has been sent to your email.");
      setTimeout(() => setSuccessMsg(""), 4000);
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0]?.focus();
        }
      }, 100);
    } catch (err: any) {
      setResendLoading(false);
      setError(err.response?.data?.message || err.message || "Failed to resend code.");
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = val.substring(val.length - 1);
    setOtpValues(newOtpValues);

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

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpValues.join("");

    if (enteredOtp.length < 6) {
      setError("Please enter the complete 6-digit OTP code sent to your email.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiService.auth.resetPassword(email.trim(), enteredOtp, newPassword);
      setLoading(false);
      setStep("success");
    } catch (err: any) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password. Please verify the code and try again."
      );
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-16 bg-brand-bg flex items-center justify-center min-h-[75vh]">
        <div className="w-full max-w-md px-4 sm:px-6">
          <div className="bg-white border border-brand-border/60 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === "request" && (
                /* Step 1: Request Reset OTP */
                <motion.div
                  key="step-request"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-brand-pink">
                      <FiLock className="w-6 h-6" />
                    </div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy">Forgot Password?</h1>
                    <p className="text-xs sm:text-sm text-brand-slate max-w-sm mx-auto">
                      Don&apos;t worry! Enter your registered email address and we&apos;ll send you a 6-digit OTP code to reset your password.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. customer@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-navy text-white font-semibold py-3.5 rounded-xl hover:bg-brand-navy/95 transition duration-200 text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <FiRefreshCw className="animate-spin w-4 h-4" />
                          <span>Sending OTP code...</span>
                        </>
                      ) : (
                        "Send Reset OTP"
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <Link
                      href="/login"
                      className="text-xs text-brand-slate hover:text-brand-navy font-medium inline-flex items-center gap-1.5 transition"
                    >
                      <FiArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Login</span>
                    </Link>
                  </div>
                </motion.div>
              )}

              {step === "verify_reset" && (
                /* Step 2: OTP Verification & New Password */
                <motion.div
                  key="step-verify"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => {
                      setStep("request");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-brand-slate hover:text-brand-navy font-medium transition"
                  >
                    <FiArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email</span>
                  </button>

                  <div className="text-center space-y-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy">Enter Code & New Password</h1>
                    <p className="text-xs sm:text-sm text-brand-slate">
                      We sent a 6-digit code to <strong className="text-brand-navy">{email}</strong>.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold text-center">
                      {error}
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold text-center">
                      {successMsg}
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-5">
                    {/* 6-Digit OTP Inputs */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy block text-center">
                        6-Digit Verification Code
                      </label>
                      <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
                        {otpValues.map((val, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              inputRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val}
                            onChange={(e) => handleOtpChange(e.target, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e.target as any, idx)}
                            onPaste={handleOtpPaste}
                            className="w-11 h-12 text-center text-lg font-bold border border-brand-border rounded-xl focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition text-brand-navy bg-brand-bg/20"
                          />
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-xs text-brand-slate pt-1 px-1">
                        <span>
                          {timer > 0 ? (
                            <span>Resend code in <strong className="text-brand-pink">{timer}s</strong></span>
                          ) : (
                            "Didn't receive code?"
                          )}
                        </span>
                        <button
                          type="button"
                          disabled={timer > 0 || resendLoading}
                          onClick={handleResendOtp}
                          className={`font-semibold transition ${
                            timer > 0 || resendLoading
                              ? "text-brand-slate/50 cursor-not-allowed"
                              : "text-brand-pink hover:underline cursor-pointer"
                          }`}
                        >
                          {resendLoading ? "Sending..." : "Resend OTP"}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-slate hover:text-brand-navy p-1"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-pink transition pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-slate hover:text-brand-navy p-1"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-navy text-white font-semibold py-3.5 rounded-xl hover:bg-brand-navy/95 transition duration-200 text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <FiRefreshCw className="animate-spin w-4 h-4" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === "success" && (
                /* Step 3: Success Screen */
                <motion.div
                  key="step-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-4 space-y-6"
                >
                  <div className="w-16 h-16 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <FiCheckCircle className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy">Password Updated!</h1>
                    <p className="text-xs sm:text-sm text-brand-slate max-w-xs mx-auto">
                      Your password has been changed successfully. You can now login to your Niela account using your new password.
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-brand-navy text-white font-semibold py-3.5 rounded-xl hover:bg-brand-navy/95 transition duration-200 text-sm shadow-sm cursor-pointer"
                  >
                    Proceed to Login
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
