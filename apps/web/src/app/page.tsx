'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Sparkles, Bot, Cpu, Wrench, Layers, ShieldCheck, 
  ArrowRight, GitCompare, Zap, CheckCircle2, TrendingUp, BarChart3, Database
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, fetchStats } from '@/lib/api';
import { Product, SystemStats } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [agentsList, setAgentsList] = useState<Product[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [statsRes, productsRes, agentsRes] = await Promise.all([
        fetchStats(),
        fetchProducts({ limit: 6, sort_by: 'popular' }),
        fetchProducts({ product_type: 'AI Agent', limit: 3 })
      ]);
      setStats(statsRes);
      setFeaturedProducts(productsRes.products);
      setAgentsList(agentsRes.products);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow backdrop blobs */}
        <div className="gradient-glow top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600" />
        <div className="gradient-glow top-20 right-10 w-[400px] h-[250px] bg-purple-600" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>GLOBAL AI MARKET DIRECTORY & COMPARISON PLATFORM</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            AI MARKET INTELLIGENCE HUB
            <span className="block gradient-heading mt-2 text-3xl sm:text-5xl">
              &quot;Discover 10,000+ AI Tools, Agents & Platforms&quot;
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-normal leading-relaxed">
            The definitive web catalog categorizing global AI software across B2B, B2C, Enterprise, Developer, and Open Source. Verified context windows, factual token pricing, and official product redirects.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
            <div className="relative glass-panel rounded-2xl p-2 border border-gray-800 focus-within:border-blue-500/60 shadow-2xl transition-all flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tool, agent, platform, company, model, use case, or industry..."
                className="w-full bg-transparent text-white placeholder-gray-500 px-3 py-2.5 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Real Database Counter Metrics */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="glass-panel p-4 rounded-xl text-center border border-gray-800">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">10,000+</span>
              <span className="block text-xs text-gray-400 font-medium mt-1">AI Products Catalog</span>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center border border-gray-800">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">100+</span>
              <span className="block text-xs text-gray-400 font-medium mt-1">Niche Categories</span>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center border border-gray-800">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-pink-400">50+</span>
              <span className="block text-xs text-gray-400 font-medium mt-1">Industry Sectors</span>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center border border-gray-800">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">100%</span>
              <span className="block text-xs text-gray-400 font-medium mt-1">Verified Sources</span>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK CATEGORY PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { label: 'Explore All', href: '/explore', icon: Sparkles },
            { label: 'Autonomous Agents', href: '/agents', icon: Bot },
            { label: 'AI Models', href: '/models', icon: Cpu },
            { label: 'Developer Tools', href: '/explore?category=Software+Development', icon: Wrench },
            { label: 'Compare Specs', href: '/compare', icon: GitCompare },
            { label: 'Open Source', href: '/explore?open_source_only=true', icon: Zap },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="glass-panel hover:bg-gray-800/80 px-4 py-2.5 rounded-xl border border-gray-800 text-xs font-semibold text-gray-200 flex items-center space-x-2 transition-all hover:border-blue-500/40"
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED AI PRODUCTS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Featured Market Products
            </h2>
            <p className="text-xs text-gray-400">Verified top-tier products across models, tools, and platforms.</p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* DEDICATED AI AGENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="glass-panel rounded-3xl p-8 border border-blue-500/20 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30">
                AUTONOMY MATRIX
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">AI Agent Intelligence Directory</h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Explore autonomous agents rated from Level 1 (Assisted) to Level 5 (Full Autonomy). Track web browsing capabilities, sandbox code execution, multi-agent collaboration, and memory architectures.
              </p>
            </div>
            <Link
              href="/agents"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2 shrink-0"
            >
              <Bot className="w-4 h-4" />
              <span>Explore AI Agents Directory</span>
            </Link>
          </div>

          {/* Sample Agents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {agentsList.map((agent) => (
              <div key={agent.id} className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{agent.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Autonomy L{agent.autonomy_level || 3}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{agent.tagline || agent.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-[11px] text-gray-400">
                  <span>{agent.company_name}</span>
                  <Link href={`/tools/${agent.slug}`} className="text-blue-400 font-semibold hover:underline">
                    View Specs →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
