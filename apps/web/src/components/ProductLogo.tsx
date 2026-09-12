"use client";

import { useState } from "react";
import { Sparkles, Bot, Wrench, Building2, Cpu } from "lucide-react";

interface ProductLogoProps {
  name: string;
  officialUrl?: string;
  logoUrl?: string;
  productType?: string;
  size?: "sm" | "md" | "lg";
}

export function ProductLogo({ 
  name, 
  officialUrl, 
  logoUrl, 
  productType = "AI Tool",
  size = "md" 
}: ProductLogoProps) {
  const [error, setError] = useState(false);

  // Extract domain for Google Favicon API fallback
  let domain = "";
  if (officialUrl) {
    try {
      domain = new URL(officialUrl).hostname.replace("www.", "");
    } catch {
      domain = "";
    }
  }

  const faviconUrl = logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null);

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "AI";

  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg text-xs",
    md: "h-10 w-10 rounded-xl text-sm",
    lg: "h-14 w-14 rounded-2xl text-lg",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  // Type gradient background
  const bgGradients = {
    "AI Agent": "from-emerald-600 to-teal-500 shadow-emerald-500/20",
    "AI Model": "from-blue-600 to-indigo-500 shadow-blue-500/20",
    "AI Tool": "from-purple-600 to-pink-500 shadow-purple-500/20",
    "AI Platform": "from-amber-600 to-orange-500 shadow-amber-500/20",
    "AI Infrastructure": "from-cyan-600 to-blue-500 shadow-cyan-500/20",
  };

  const gradientClass = bgGradients[productType as keyof typeof bgGradients] || "from-blue-600 to-indigo-500 shadow-blue-500/20";

  return (
    <div className={`relative flex items-center justify-center bg-slate-900 border border-slate-800 shrink-0 overflow-hidden shadow-md ${sizeClasses[size]}`}>
      {faviconUrl && !error ? (
        <img
          src={faviconUrl}
          alt={`${name} logo`}
          className="h-full w-full object-contain p-1.5"
          onError={() => setError(true)}
        />
      ) : (
        <div className={`h-full w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold tracking-wider`}>
          {initials}
        </div>
      )}
    </div>
  );
}
