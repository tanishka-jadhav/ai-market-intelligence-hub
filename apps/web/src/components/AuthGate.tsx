"use client";

import React, { useState, useEffect } from "react";
import { Lock, Sparkles, KeyRound, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

const ACCESS_CODE = "NIKETPATIL2026";
const AUTH_STORAGE_KEY = "aimarkethub_access_code";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCode = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedCode && savedCode.trim().toUpperCase() === ACCESS_CODE) {
      setIsAuthenticated(true);
    }

    const handleLockEvent = () => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
      setInputCode("");
      setError(false);
    };

    window.addEventListener("lock_platform_session", handleLockEvent);
    return () => window.removeEventListener("lock_platform_session", handleLockEvent);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsSubmitting(true);

    setTimeout(() => {
      if (inputCode.trim().toUpperCase() === ACCESS_CODE) {
        localStorage.setItem(AUTH_STORAGE_KEY, ACCESS_CODE);
        setIsAuthenticated(true);
      } else {
        setError(true);
      }
      setIsSubmitting(false);
    }, 200);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center animate-pulse">
          <Sparkles className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Glowing Background Radial Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-8">
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-blue-500/20 mb-2">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">AI MARKET HUB</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                Protected Access
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Enter your authorized access code to unlock the AI Discovery Platform & Market Intelligence Hub.
            </p>
          </div>

          {/* Auth Card */}
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  Authorization Access Code
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Enter security code..."
                    autoFocus
                    className={`w-full bg-slate-950 border ${
                      error ? "border-rose-500 focus:border-rose-400" : "border-slate-800 focus:border-blue-500"
                    } rounded-xl px-4 py-3.5 text-base font-mono text-white placeholder-slate-500 focus:outline-none transition-all tracking-wider`}
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-rose-400 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Invalid Access Code. Please enter the correct authorization key.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !inputCode.trim()}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Verifying..." : "UNLOCK DASHBOARD & UI"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Catalog
              </span>
              <span>10,000+ AI Products</span>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-slate-600 font-mono">
            AI Market Hub Security Gate • Authorization Code Required
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function lockPlatformSession() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("lock_platform_session"));
  }
}
