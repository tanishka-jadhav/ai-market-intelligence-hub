'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Check, Sparkles, Cpu, Bot, Code, Zap } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoriesList = product.categories?.map(c => c.name).slice(0, 3).join(' • ') || 'General AI';
  const businessModelsList = product.business_models?.slice(0, 3).join(' | ') || 'B2B';
  const verifiedDate = product.last_verified ? new Date(product.last_verified).toISOString().split('T')[0] : '2026-09-12';

  const formatContextWindow = (tokens?: number) => {
    if (!tokens) return 'Not publicly specified';
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M tokens`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}k tokens`;
    return `${tokens} tokens`;
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-gray-800 flex flex-col justify-between relative group overflow-hidden">
      
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header: Logo, Name, Company, Product Type */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center font-bold text-lg text-blue-400 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
              {product.logo_url && product.logo_url.startsWith('http') ? (
                <img src={product.logo_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span>{product.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Link href={`/tools/${product.slug}`}>
                  {product.name}
                </Link>
              </h3>
              <p className="text-xs text-gray-400 font-medium">{product.company_name || 'Independent'}</p>
            </div>
          </div>
          
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {product.product_type}
          </span>
        </div>

        {/* Categories Tagline */}
        <div className="mt-3 text-xs text-blue-300/80 font-medium line-clamp-1">
          {categoriesList}
        </div>

        {/* Business Model Badges */}
        <div className="mt-1 text-[11px] font-mono text-gray-400">
          {businessModelsList}
        </div>

        {/* Spec Overview Pill Grid */}
        <div className="mt-4 py-2.5 px-3 rounded-xl bg-gray-950/60 border border-gray-800/80 space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-gray-300">
            <span>Free Plan:</span>
            <span className={`font-semibold ${product.free_plan_available ? 'text-emerald-400' : 'text-gray-400'}`}>
              {product.free_plan_available ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span>Paid Tiers:</span>
            <span className="font-semibold text-blue-400">Available</span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span>API Availability:</span>
            <span className={`font-semibold ${product.api_available ? 'text-blue-400' : 'text-gray-400'}`}>
              {product.api_available ? 'Available' : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-300 pt-1 border-t border-gray-800/60">
            <span className="text-gray-400">Context Window:</span>
            <span className="font-mono font-bold text-white">
              {formatContextWindow(product.context_window)}
            </span>
          </div>
        </div>

        {/* Last Verified Timestamp */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Last Verified:
          </span>
          <span className="text-gray-300">{verifiedDate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-gray-800/80">
        <Link
          href={`/tools/${product.slug}`}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-center bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700/80 transition-all"
        >
          VIEW DETAILS
        </Link>
        <a
          href={`/api/v1/redirect?product_id=${product.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-center bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center space-x-1"
        >
          <span>OPEN OFFICIAL WEBSITE</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>

    </div>
  );
}
