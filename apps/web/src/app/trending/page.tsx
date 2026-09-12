'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types';

export default function TrendingPage() {
  const [trending, setTrending] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      setLoading(true);
      const res = await fetchProducts({ sort_by: 'popular', limit: 12 });
      setTrending(res.products);
      setLoading(false);
    }
    loadTrending();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 text-xs font-semibold">
          <TrendingUp className="w-4 h-4 text-pink-400" />
          <span>MARKET VELOCITY & POPULARITY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Trending AI Tools, Agents & Platforms
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Ranked by internal telemetry metrics, outbound verification interest, and market discovery activity. Zero fabricated rank manipulation.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">Loading trending products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
}
