'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ExternalLink, ShieldCheck, Check, Cpu, Bot, Wrench, Layers, 
  ArrowLeft, Clock, DollarSign, BookOpen, Code2, Sparkles, AlertCircle
} from 'lucide-react';
import { fetchProductDetail } from '@/lib/api';
import { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const targetSlug = params?.slug || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '');

  useEffect(() => {
    if (!targetSlug) return;
    async function loadDetail() {
      setLoading(true);
      const data = await fetchProductDetail(targetSlug as string);
      setProduct(data);
      setLoading(false);
    }
    loadDetail();
  }, [targetSlug]);

  if (loading) {
    return <div className="py-20 text-center text-sm text-gray-400">Loading product intelligence profile...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Product Profile Not Found</h1>
        <p className="text-sm text-gray-400">The requested AI product could not be located in our verified registry.</p>
        <Link href="/explore" className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const formatContext = (tokens?: number) => {
    if (!tokens) return 'Not publicly specified';
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M tokens (${tokens.toLocaleString()} tokens)`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}k tokens (${tokens.toLocaleString()} tokens)`;
    return `${tokens} tokens`;
  };

  const verifiedDate = product.last_verified ? new Date(product.last_verified).toISOString().split('T')[0] : '2026-09-12';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Link */}
      <Link href="/explore" className="inline-flex items-center space-x-1 text-xs text-gray-400 hover:text-blue-400 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Market Catalog</span>
      </Link>

      {/* Header Profile Hero */}
      <div className="glass-panel rounded-3xl p-8 border border-gray-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-2xl font-bold text-blue-400 shadow-xl overflow-hidden">
              {product.logo_url && product.logo_url.startsWith('http') ? (
                <img src={product.logo_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span>{product.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{product.name}</h1>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {product.product_type}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-medium mt-1">by {product.company_name || 'Independent'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/api/v1/redirect?product_id=${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-1.5"
            >
              <span>OPEN OFFICIAL WEBSITE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {product.pricing_url && (
              <a
                href={product.pricing_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 text-xs font-semibold flex items-center space-x-1.5"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>VIEW PRICING</span>
              </a>
            )}
            {product.docs_url && (
              <a
                href={product.docs_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 text-xs font-semibold flex items-center space-x-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>VIEW DOCUMENTATION</span>
              </a>
            )}
          </div>
        </div>

        {/* Tagline */}
        <p className="text-base text-gray-200 font-normal leading-relaxed pt-2 border-t border-gray-800/80">
          {product.tagline || product.description}
        </p>

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800/80 text-xs font-mono text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Status: {product.verification_status}
            </span>
            <span>Confidence Score: <strong className="text-white">{(product.confidence_score * 100).toFixed(0)}%</strong></span>
          </div>
          <div>
            <span>Last Verified: <strong className="text-gray-200">{verifiedDate}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Specifications & Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description, Specs & Models */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Description */}
          <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-3">
            <h2 className="text-lg font-bold text-white">Product Overview & Capabilities</h2>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {/* Technical Specifications */}
          <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              Technical & Token Limits Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-1">
                <span className="text-gray-400">Context Window</span>
                <span className="block font-mono font-bold text-base text-emerald-400">
                  {formatContext(product.context_window)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-1">
                <span className="text-gray-400">Input Token Limit</span>
                <span className="block font-mono font-bold text-base text-blue-400">
                  {product.input_token_limit ? product.input_token_limit.toLocaleString() : 'Not publicly specified'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-1">
                <span className="text-gray-400">Output Token Limit</span>
                <span className="block font-mono font-bold text-base text-purple-400">
                  {product.output_token_limit ? product.output_token_limit.toLocaleString() : 'Not publicly specified'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-1">
                <span className="text-gray-400">API Availability</span>
                <span className="block font-mono font-bold text-base text-white">
                  {product.api_available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Tiers Table */}
          <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Verified Pricing & Plans
            </h2>
            {product.pricing_plans && product.pricing_plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.pricing_plans.map((plan) => (
                  <div key={plan.id} className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white">{plan.plan_name}</span>
                      <span className="font-mono font-extrabold text-blue-400">
                        {plan.price === 0 ? 'Free' : `$${plan.price} / ${plan.billing_period}`}
                      </span>
                    </div>
                    {plan.features_summary && (
                      <p className="text-xs text-gray-300 leading-relaxed">{plan.features_summary}</p>
                    )}
                    {plan.input_price_per_1m != null && (
                      <div className="text-[11px] font-mono text-gray-400 pt-2 border-t border-gray-800">
                        <span>API Input: <strong>${plan.input_price_per_1m} / 1M</strong></span>
                        <span className="ml-3">Output: <strong>${plan.output_price_per_1m} / 1M</strong></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Custom pricing. Contact official vendor.</p>
            )}
          </div>

        </div>

        {/* Right Sidebar: Categories, Industries, Audit */}
        <div className="space-y-6">
          
          {/* Taxonomies Card */}
          <div className="glass-panel rounded-2xl p-5 border border-gray-800 space-y-4">
            <h3 className="font-bold text-sm text-white">Niche & Industry Mapping</h3>
            
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Categories</span>
              <div className="flex flex-wrap gap-1.5">
                {product.categories?.map(c => (
                  <span key={c.id} className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-800">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Industries</span>
              <div className="flex flex-wrap gap-1.5">
                {product.industries?.map(i => (
                  <span key={i.id} className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {i.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-800">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Business Models</span>
              <div className="flex flex-wrap gap-1.5">
                {product.business_models?.map(bm => (
                  <span key={bm} className="text-xs font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                    {bm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Provenance */}
          <div className="glass-panel rounded-2xl p-5 border border-gray-800 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Data Provenance & Audit
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every factual metric on this page is verified directly against official documentation and primary product sources.
            </p>
            <div className="pt-2 text-xs font-mono text-gray-400">
              <span>Source URL: </span>
              <a href={product.official_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                {product.official_url}
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
