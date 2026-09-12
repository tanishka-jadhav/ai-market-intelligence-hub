'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GitCompare, Plus, X, ExternalLink, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { fetchProducts, compareProducts } from '@/lib/api';
import { Product, ComparisonResponse } from '@/types';

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['prod-001', 'prod-002', 'prod-003']);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      const res = await fetchProducts({ limit: 50 });
      setAvailableProducts(res.products);
    }
    loadCatalog();
  }, []);

  useEffect(() => {
    async function loadComparison() {
      if (selectedIds.length === 0) {
        setComparisonData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await compareProducts(selectedIds);
      setComparisonData(res);
      setLoading(false);
    }
    loadComparison();
  }, [selectedIds]);

  const handleAddProduct = (id: string) => {
    if (id && !selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedIds(selectedIds.filter(item => item !== id));
  };

  const formatContext = (tokens?: number) => {
    if (!tokens) return 'Not publicly specified';
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M tokens`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}k tokens`;
    return `${tokens} tokens`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-blue-400" />
            Side-by-Side AI Tool & Model Comparison Matrix
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Compare specs, context windows, token limits, pricing models, and API availability across up to 4 products.
          </p>
        </div>

        {/* Product Picker Dropdown */}
        {selectedIds.length < 4 && (
          <div className="flex items-center space-x-2">
            <select
              onChange={(e) => {
                handleAddProduct(e.target.value);
                e.target.value = '';
              }}
              className="bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
            >
              <option value="">+ Add Product to Compare</option>
              {availableProducts
                .filter(p => !selectedIds.includes(p.id))
                .map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.product_type})</option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Grid Table */}
      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">Loading comparison matrix...</div>
      ) : !comparisonData || comparisonData.products.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-gray-800 text-gray-400 text-sm">
          No products selected for comparison. Choose products from the dropdown above.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Product Header Cards */}
              <thead>
                <tr className="bg-gray-900/90 border-b border-gray-800">
                  <th className="p-5 w-1/5 text-xs uppercase tracking-wider text-gray-400 font-mono">
                    Specifications
                  </th>
                  {comparisonData.products.map((prod) => (
                    <th key={prod.id} className="p-5 relative border-l border-gray-800/80 align-top">
                      <button
                        onClick={() => handleRemoveProduct(prod.id)}
                        className="absolute top-3 right-3 p-1 rounded-full bg-gray-800 text-gray-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {prod.product_type}
                        </span>
                        <h3 className="font-bold text-base text-white">{prod.name}</h3>
                        <p className="text-xs text-gray-400">{prod.company_name}</p>
                        <a
                          href={`/api/v1/redirect?product_id=${prod.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:text-blue-300 pt-1"
                        >
                          <span>Official Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Rows */}
              <tbody className="divide-y divide-gray-800/60 text-xs font-medium text-gray-200">
                
                {/* Free Plan */}
                <tr className="hover:bg-gray-800/30">
                  <td className="p-4 font-semibold text-gray-400">Free Plan Available</td>
                  {comparisonData.products.map(p => (
                    <td key={p.id} className="p-4 border-l border-gray-800/80">
                      <span className={p.free_plan_available ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                        {p.free_plan_available ? 'Yes (Free Tier Available)' : 'No (Paid Only)'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Starting Price */}
                <tr className="hover:bg-gray-800/30">
                  <td className="p-4 font-semibold text-gray-400">Starting Price</td>
                  {comparisonData.products.map(p => {
                    const firstPlan = p.pricing_plans?.[0];
                    return (
                      <td key={p.id} className="p-4 border-l border-gray-800/80 font-mono text-blue-400">
                        {firstPlan ? `$${firstPlan.price} / ${firstPlan.billing_period}` : 'Custom Pricing'}
                      </td>
                    );
                  })}
                </tr>

                {/* Context Window */}
                <tr className="hover:bg-gray-800/30 bg-blue-950/10">
                  <td className="p-4 font-semibold text-gray-300">Context Window</td>
                  {comparisonData.products.map(p => (
                    <td key={p.id} className="p-4 border-l border-gray-800/80 font-mono font-bold text-white">
                      {formatContext(p.context_window)}
                    </td>
                  ))}
                </tr>

                {/* API Availability */}
                <tr className="hover:bg-gray-800/30">
                  <td className="p-4 font-semibold text-gray-400">API Availability</td>
                  {comparisonData.products.map(p => (
                    <td key={p.id} className="p-4 border-l border-gray-800/80">
                      <span className={p.api_available ? 'text-blue-400 font-bold' : 'text-gray-500'}>
                        {p.api_available ? 'Available' : 'N/A'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Open Source */}
                <tr className="hover:bg-gray-800/30">
                  <td className="p-4 font-semibold text-gray-400">Open Source Status</td>
                  {comparisonData.products.map(p => (
                    <td key={p.id} className="p-4 border-l border-gray-800/80">
                      <span className={p.open_source_status ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                        {p.open_source_status ? 'Open Source / Weights' : 'Proprietary'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Autonomy Level */}
                <tr className="hover:bg-gray-800/30">
                  <td className="p-4 font-semibold text-gray-400">Autonomy Level</td>
                  {comparisonData.products.map(p => (
                    <td key={p.id} className="p-4 border-l border-gray-800/80 font-mono text-purple-400 font-bold">
                      {p.autonomy_level ? `Level ${p.autonomy_level}` : 'Level 1 (Assisted)'}
                    </td>
                  ))}
                </tr>

                {/* Verification Status */}
                <tr className="hover:bg-gray-800/30">
                  <td className="p-4 font-semibold text-gray-400">Verification Status</td>
                  {comparisonData.products.map(p => (
                    <td key={p.id} className="p-4 border-l border-gray-800/80">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {p.verification_status}
                      </span>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
