'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';
import { fetchIndustries } from '@/lib/api';
import { Industry } from '@/types';

export default function IndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchIndustries();
      setIndustries(res);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <Layers className="w-6 h-6 text-purple-400" />
          Industry Sectors Classification
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Discover AI solutions customized for BFSI, Healthcare, Pharma, E-commerce, Legal, Software, Education, and Enterprise sectors.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">Loading industry sectors...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((ind) => (
            <Link
              key={ind.id}
              href={`/explore?industry=${ind.slug}`}
              className="glass-panel glass-panel-hover p-5 rounded-2xl border border-gray-800 flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">{ind.name}</h3>
                <span className="text-[10px] text-gray-400 font-mono">Industry Sector</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
