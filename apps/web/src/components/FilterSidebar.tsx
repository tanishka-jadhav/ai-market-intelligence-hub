'use client';

import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Category, Industry } from '@/types';

interface FilterSidebarProps {
  categories: Category[];
  industries: Industry[];
  selectedType: string;
  setSelectedType: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (val: string) => void;
  selectedBusinessModel: string;
  setSelectedBusinessModel: (val: string) => void;
  freeOnly: boolean;
  setFreeOnly: (val: boolean) => void;
  apiOnly: boolean;
  setApiOnly: (val: boolean) => void;
  openSourceOnly: boolean;
  setOpenSourceOnly: (val: boolean) => void;
  minContext: number;
  setMinContext: (val: number) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  categories,
  industries,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedIndustry,
  setSelectedIndustry,
  selectedBusinessModel,
  setSelectedBusinessModel,
  freeOnly,
  setFreeOnly,
  apiOnly,
  setApiOnly,
  openSourceOnly,
  setOpenSourceOnly,
  minContext,
  setMinContext,
  onReset
}: FilterSidebarProps) {
  const productTypes = [
    'All Types',
    'AI Agent',
    'AI Tool',
    'AI Platform',
    'AI Model',
    'AI API',
    'AI SaaS',
    'AI Developer Tool',
    'AI Infrastructure',
    'AI Creative Tool'
  ];

  const businessModels = [
    'All Models',
    'B2B',
    'B2C',
    'Enterprise',
    'Developer',
    'Open Source',
    'API',
    'Freemium'
  ];

  return (
    <aside className="glass-panel rounded-2xl p-5 border border-gray-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <h2 className="font-bold text-sm text-white">Filters & Facets</h2>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-blue-400 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Product Type Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Product Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
        >
          {productTypes.map(t => (
            <option key={t} value={t === 'All Types' ? '' : t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Category / Niche</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Industry Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Industry</label>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Industries</option>
          {industries.map(i => (
            <option key={i.id} value={i.slug}>{i.name}</option>
          ))}
        </select>
      </div>

      {/* Business Model Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Business Model</label>
        <select
          value={selectedBusinessModel}
          onChange={(e) => setSelectedBusinessModel(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
        >
          {businessModels.map(bm => (
            <option key={bm} value={bm === 'All Models' ? '' : bm}>{bm}</option>
          ))}
        </select>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-3 pt-3 border-t border-gray-800">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Access & Licensing</label>
        
        <label className="flex items-center space-x-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-0"
          />
          <span className="text-xs text-gray-300 group-hover:text-white">Free Plan Available</span>
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={apiOnly}
            onChange={(e) => setApiOnly(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-0"
          />
          <span className="text-xs text-gray-300 group-hover:text-white">API Available</span>
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={openSourceOnly}
            onChange={(e) => setOpenSourceOnly(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-0"
          />
          <span className="text-xs text-gray-300 group-hover:text-white">Open Source Only</span>
        </label>
      </div>

      {/* Context Window Slider */}
      <div className="space-y-2 pt-3 border-t border-gray-800">
        <div className="flex justify-between items-center text-xs">
          <label className="font-semibold text-gray-300 uppercase tracking-wider">Min Context Window</label>
          <span className="font-mono text-blue-400 font-bold">{minContext > 0 ? `${minContext / 1000}k` : 'Any'}</span>
        </div>
        <input
          type="range"
          min="0"
          max="200000"
          step="10000"
          value={minContext}
          onChange={(e) => setMinContext(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

    </aside>
  );
}
