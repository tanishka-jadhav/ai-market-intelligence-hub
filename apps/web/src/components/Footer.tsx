import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Database, Lock, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-base text-white tracking-tight">AI MARKET HUB</span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              The premier AI market intelligence directory and comparison platform discovering over 10,000+ AI tools, agents, models, and SaaS platforms.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Factual & Verified Sources</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-4">Directories</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><Link href="/explore" className="hover:text-blue-400 transition-colors">Explore All AI Products</Link></li>
              <li><Link href="/agents" className="hover:text-blue-400 transition-colors">AI Agents Directory</Link></li>
              <li><Link href="/models" className="hover:text-blue-400 transition-colors">AI Models Database</Link></li>
              <li><Link href="/explore?product_type=AI+Platform" className="hover:text-blue-400 transition-colors">AI Platforms</Link></li>
              <li><Link href="/explore?open_source_only=true" className="hover:text-blue-400 transition-colors">Open Source AI</Link></li>
            </ul>
          </div>

          {/* Taxonomies */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-4">Taxonomies</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><Link href="/categories" className="hover:text-blue-400 transition-colors">Niche & Categories</Link></li>
              <li><Link href="/industries" className="hover:text-blue-400 transition-colors">Industry Sectors</Link></li>
              <li><Link href="/compare" className="hover:text-blue-400 transition-colors">Side-by-Side Comparison</Link></li>
              <li><Link href="/trending" className="hover:text-blue-400 transition-colors">Trending AI Tools</Link></li>
            </ul>
          </div>

          {/* Governance & Admin */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-4">Platform Governance</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><Link href="/admin" className="hover:text-blue-400 transition-colors flex items-center gap-1.5"><Lock className="w-3 h-3 text-gray-400" /> Admin Portal</Link></li>
              <li><span className="text-gray-500">Data Verification SLA: Daily</span></li>
              <li><span className="text-gray-500">Confidence Metric: Tier 1</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-3 sm:space-y-0">
          <div>
            © 2026 AI Market Intelligence Hub. All rights reserved. Zero fabricated metrics guarantee.
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-400">
              v1.0.0 Stable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
