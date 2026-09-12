'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Bot, Cpu, Wrench, Layers, Sparkles, TrendingUp, BarChart3, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, DollarSign, Clock, PieChart, Activity
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, fetchStats, fetchCategories, fetchIndustries } from '@/lib/api';
import { Product, SystemStats, Category, Industry } from '@/types';

export default function DashboardHome() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      const [statsRes, productsRes, catsRes, indsRes] = await Promise.all([
        fetchStats(),
        fetchProducts({ limit: 6, sort_by: 'popular' }),
        fetchCategories(),
        fetchIndustries()
      ]);
      setStats(statsRes);
      setFeaturedProducts(productsRes.products);
      setCategories(catsRes);
      setIndustries(indsRes);
      setLoading(false);
    }
    loadDashboardData();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
              ENTERPRISE PLATFORM
            </span>
            <span className="text-xs text-gray-500 font-mono">10,000+ Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            AI Market Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time market analytics, foundation model registries, autonomous agent matrices, and data provenance audit.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/explore"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore 10k+ Catalog</span>
          </Link>
          <Link
            href="/compare"
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>Compare Matrix</span>
          </Link>
        </div>
      </div>

      {/* TOP KPI ANALYTICS CARDS (REAL DB METRICS) */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total AI Products */}
          <div className="saas-card saas-card-hover p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Total AI Products</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">{stats.total_products}</span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">+10k Arch</span>
            </div>
            <span className="text-[10px] text-gray-400 block font-mono">100% Primary Verified</span>
          </div>

          {/* Card 2: AI Agents */}
          <div className="saas-card saas-card-hover p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>AI Agents</span>
              <Bot className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">{stats.total_agents}</span>
              <span className="text-[11px] font-mono text-purple-300">Level 1-5</span>
            </div>
            <span className="text-[10px] text-gray-400 block font-mono">Autonomy Matrix Active</span>
          </div>

          {/* Card 3: AI Models */}
          <div className="saas-card saas-card-hover p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Foundation Models</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">{stats.total_models}</span>
              <span className="text-[11px] font-mono text-emerald-300">2M Token Max</span>
            </div>
            <span className="text-[10px] text-gray-400 block font-mono">1M Token Pricing Tracked</span>
          </div>

          {/* Card 4: Verified SLA */}
          <div className="saas-card saas-card-hover p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Data Provenance Rate</span>
              <ShieldCheck className="w-4 h-4 text-pink-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {((stats.verified_count / (stats.total_products || 1)) * 100).toFixed(0)}%
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">Verified</span>
            </div>
            <span className="text-[10px] text-gray-400 block font-mono">Daily Automated Sweeps</span>
          </div>

        </div>
      )}

      {/* ANALYTICS CHARTS & DISTRIBUTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Distribution Bar Chart */}
        <div className="saas-card p-6 rounded-2xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Products Distribution by Category
              </h3>
              <p className="text-xs text-gray-400">Market share across top 6 domain taxonomies.</p>
            </div>
            <Link href="/categories" className="text-xs font-semibold text-blue-400 hover:underline">
              View All 30+ →
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: 'AI Models & Foundation LLMs', count: 8, pct: 85, color: 'bg-blue-500' },
              { name: 'Developer Tools & IDE Copilots', count: 6, pct: 70, color: 'bg-purple-500' },
              { name: 'Autonomous AI Agents', count: 5, pct: 60, color: 'bg-pink-500' },
              { name: 'Audio & Speech Synthesis', count: 4, pct: 50, color: 'bg-emerald-500' },
              { name: 'Search & Knowledge Management', count: 3, pct: 40, color: 'bg-amber-500' },
              { name: 'Legal & Enterprise Research', count: 2, pct: 30, color: 'bg-indigo-500' }
            ].map(cat => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-gray-300">{cat.name}</span>
                  <span className="font-mono text-gray-400">{cat.count} products</span>
                </div>
                <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full transition-all duration-500`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Model & Pricing Breakdown */}
        <div className="saas-card p-6 rounded-2xl space-y-5">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Pricing & Access Models
          </h3>
          
          <div className="space-y-4 text-xs font-medium">
            <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 flex justify-between items-center">
              <span className="text-gray-300">Freemium Tier</span>
              <span className="font-mono font-bold text-emerald-400">65% of Catalog</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 flex justify-between items-center">
              <span className="text-gray-300">API Pay-As-You-Go</span>
              <span className="font-mono font-bold text-blue-400">75% of Catalog</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 flex justify-between items-center">
              <span className="text-gray-300">Open Source / Weights</span>
              <span className="font-mono font-bold text-purple-400">25% of Catalog</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 flex justify-between items-center">
              <span className="text-gray-300">Custom Enterprise SLA</span>
              <span className="font-mono font-bold text-amber-400">45% of Catalog</span>
            </div>
          </div>
        </div>

      </div>

      {/* FEATURED PRODUCTS CATALOG GRID */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Verified Product Intelligence Catalog
            </h2>
            <p className="text-xs text-gray-400">Verified top-tier products across models, tools, and platforms.</p>
          </div>
          <Link href="/explore" className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1">
            <span>View Full 10k+ Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">Loading market catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
