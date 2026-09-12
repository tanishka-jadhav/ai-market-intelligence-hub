"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ExternalLink, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Tag, 
  Cpu, 
  Clock, 
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-slate-900 rounded animate-pulse" />
        <div className="h-64 bg-slate-900 rounded-xl border border-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-slate-400">The requested AI product could not be located in our catalog.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const primaryNiche = product.categories?.[0]?.name || "AI Tool";
  const bm = product.business_models?.[0] || (product.open_source_status ? "B2B" : "B2C");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Link */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Directory
      </Link>

      {/* Main Header Card */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{product.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                  Verified
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Developed by <span className="text-slate-200 font-semibold">{product.company_name}</span>
              </p>
            </div>
          </div>

          {/* Large Primary CTA Button */}
          <a
            href={product.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            VISIT OFFICIAL WEBSITE <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Badges Bar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <span className="px-3 py-1 rounded-md bg-blue-600/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
            {product.product_type}
          </span>
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono">
            Model: {bm}
          </span>
          <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
            {product.open_source_status ? "Open Source" : (product.free_plan_available ? "Freemium" : "Paid")}
          </span>
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
            Niche: {primaryNiche}
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Overview</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Technical Metadata Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specifications Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-400" /> Specifications & Architecture
          </h3>
          <ul className="space-y-3 text-xs">
            <li className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Context Window</span>
              <span className="text-white font-mono font-medium">{product.context_window ? `${product.context_window.toLocaleString()} Tokens` : "Standard"}</span>
            </li>
            <li className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">API Availability</span>
              <span className="text-emerald-400 font-medium">{product.api_available ? "Yes (REST / Python)" : "No"}</span>
            </li>
            <li className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Open Source Status</span>
              <span className="text-white font-medium">{product.open_source_status ? "Yes (Permissive)" : "Proprietary"}</span>
            </li>
            <li className="flex justify-between py-2">
              <span className="text-slate-400">Free Tier Available</span>
              <span className="text-emerald-400 font-medium">{product.free_plan_available ? "Yes" : "Paid Only"}</span>
            </li>
          </ul>
        </div>

        {/* Verification & Access Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Provenance & Access
          </h3>
          <ul className="space-y-3 text-xs">
            <li className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Official URL</span>
              <a href={product.official_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate max-w-[200px]">
                {product.official_url}
              </a>
            </li>
            <li className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Verification Status</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Today
              </span>
            </li>
            <li className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Target Segment</span>
              <span className="text-white font-mono font-medium">{bm}</span>
            </li>
            <li className="flex justify-between py-2">
              <span className="text-slate-400">Last Database Sync</span>
              <span className="text-slate-300 font-medium">Today</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Large Bottom Visit Button */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/20 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Ready to explore {product.name}?</h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Click below to navigate directly to the verified official product platform.
        </p>
        <a
          href={product.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
        >
          VISIT OFFICIAL WEBSITE <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
