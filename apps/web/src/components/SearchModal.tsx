'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Bot, Cpu, Wrench, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await fetchProducts({ q: query, limit: 6 });
      setResults(res.products);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-blue-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI agents, tools, models, use cases, pricing..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-base font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-500 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-2 py-1 text-xs font-mono bg-gray-800 text-gray-400 rounded">
            ESC
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {loading && (
            <div className="p-6 text-center text-sm text-gray-400">
              Searching verified market catalog...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-400">
              No matching AI products found for &quot;{query}&quot;.
            </div>
          )}

          {!loading && results.map((prod) => (
            <div
              key={prod.id}
              onClick={() => {
                router.push(`/tools/${prod.slug}`);
                onClose();
              }}
              className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 hover:border-blue-500/40 hover:bg-gray-800/50 cursor-pointer flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-blue-400 border border-gray-700">
                  {prod.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {prod.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {prod.product_type}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{prod.tagline || prod.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}

          {!query && (
            <div className="space-y-4 p-2">
              <div className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Popular Searches</div>
              <div className="flex flex-wrap gap-2">
                {['Claude 3.5 Sonnet', 'GPT-4o', 'Devin', 'Cursor', 'ElevenLabs', 'Gemini 1.5 Pro', 'CrewAI', 'Llama 3.1'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700/60"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-gray-950 border-t border-gray-800 text-xs text-gray-500 flex items-center justify-between">
          <span>Search 10,000+ AI Tools, Agents, & Models</span>
          <span className="font-mono text-[10px]">Updated Daily</span>
        </div>

      </div>
    </div>
  );
}
