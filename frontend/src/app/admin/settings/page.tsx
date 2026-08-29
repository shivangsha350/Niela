"use client";

import React, { useState } from "react";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import apiService from "@/services/api";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      await apiService.auth.updatePassword(currentPassword, newPassword);
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to update password. Please check your current password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-navy">Account Settings</h1>
        <p className="text-xs sm:text-sm text-brand-slate">Manage your administrative security credentials and update your password.</p>
      </div>

      <div className="bg-white border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="font-serif font-bold text-brand-navy text-lg pb-4 border-b border-brand-border/40 mb-6 flex items-center gap-2">
          <FiLock className="w-5 h-5 text-brand-pink" /> Change Admin Password
        </h3>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs sm:text-sm font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-pink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-navy text-white font-semibold py-3 rounded-xl hover:bg-brand-navy/95 transition text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
