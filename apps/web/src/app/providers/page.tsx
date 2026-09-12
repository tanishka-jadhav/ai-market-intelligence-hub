"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ExternalLink, Search } from "lucide-react";
import { ProductLogo } from "@/components/ProductLogo";

interface ProviderItem {
  id: string;
  name: string;
  count: number;
  website_url: string;
  niche: string;
  business_models: string[];
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/products?page=1&limit=100");
        if (res.ok) {
          const data = await res.json();
          const items = data.products || data.items || [];
          
          const compMap: { [key: string]: ProviderItem } = {};
          items.forEach((item: any) => {
            const name = item.company_name || "Independent";
            if (!compMap[name]) {
              compMap[name] = {
                id: item.company_id || name,
                name: name,
                count: 0,
                website_url: item.company_website || item.official_url || "https://ai.google",
                niche: item.categories?.[0]?.name || "Artificial Intelligence",
                business_models: item.business_models || ["B2B", "B2C"]
              };
            }
            compMap[name].count += 1;
          });

          setProviders(Object.values(compMap).sort((a, b) => b.count - a.count));
        }
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, []);

  const filtered = providers.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.niche.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">AI Providers & Platforms</h1>
        <p className="text-slate-400 mt-2">
          Discover top companies, labs, and open-source platforms powering the AI ecosystem.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search AI providers (e.g. OpenAI, Anthropic)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-44 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((provider) => (
            <div 
              key={provider.name}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <ProductLogo 
                    name={provider.name}
                    officialUrl={provider.website_url}
                    productType="AI Platform"
                    size="md"
                  />
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-blue-400 font-medium">
                    {provider.count} {provider.count === 1 ? "Product" : "Products"}
                  </span>
                </div>

                <h3 className="font-bold text-white text-lg mt-3 group-hover:text-blue-400 transition-colors">
                  {provider.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Primary Niche: <span className="text-slate-300 font-medium">{provider.niche}</span>
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {provider.business_models.map(bm => (
                    <span key={bm} className="px-2 py-0.5 rounded bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700/60 font-mono">
                      {bm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Official Provider</span>
                <a
                  href={provider.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Visit Provider <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
