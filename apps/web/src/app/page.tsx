"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Bot, 
  Wrench, 
  Building2, 
  Sparkles, 
  ExternalLink, 
  Search, 
  Layers,
  Tag
} from "lucide-react";
import { ProductLogo } from "@/components/ProductLogo";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  product_type: string;
  company_name: string;
  official_url: string;
  logo_url?: string;
  open_source_status: boolean;
  free_plan_available: boolean;
  categories: { id: string; name: string }[];
  business_models: string[];
}

export default function DashboardHome() {
  const [stats, setStats] = useState({
    total_products: 12739,
    total_agents: 253,
    total_tools: 101,
    total_providers: 4125,
  });

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedBusinessModel, setSelectedBusinessModel] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(12739);

  const niches = [
    "Development", "Marketing", "Sales", "Finance", "Healthcare", 
    "Education", "Design", "Video", "Image", "Audio", "Writing", 
    "Productivity", "Automation", "Research", "Cybersecurity", 
    "E-commerce", "Legal", "HR", "Customer Support", "Social Media", 
    "SEO", "Data Analytics", "AI Infrastructure", "AI Agents"
  ];

  const businessModels = ["B2B", "B2C", "C2C", "D2C"];
  const pricingOptions = ["Free", "Freemium", "Paid"];

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            total_products: data.total_products || 12739,
            total_agents: data.total_agents || 253,
            total_tools: data.total_tools || 101,
            total_providers: 4125,
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let url = `http://127.0.0.1:8000/api/v1/products?page=${page}&limit=24`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (selectedNiche) url += `&category=${encodeURIComponent(selectedNiche)}`;
        if (selectedBusinessModel) url += `&business_model=${encodeURIComponent(selectedBusinessModel)}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || data.items || []);
          setTotalCount(data.total || 12739);
          setTotalPages(data.pages || 1);
        }
      } catch (err) {
        console.error("Error fetching catalog products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [page, search, selectedNiche, selectedBusinessModel]);

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">AI Market Hub</h1>
        <p className="text-slate-400 mt-2 text-base">
          Discover 10,000+ AI agents, tools and platforms across industries and niches.
        </p>
      </div>

      {/* Top 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">10K+ AI Products</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.total_products.toLocaleString()}+</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Agents</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.total_agents.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Tools</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.total_tools.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Wrench className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Providers</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.total_providers.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search AI agents, tools, platforms..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedNiche}
            onChange={(e) => { setSelectedNiche(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Niches ▼</option>
            {niches.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <select
            value={selectedBusinessModel}
            onChange={(e) => { setSelectedBusinessModel(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="">Business Model ▼</option>
            {businessModels.map((bm) => (
              <option key={bm} value={bm}>{bm}</option>
            ))}
          </select>

          <select
            value={selectedPricing}
            onChange={(e) => { setSelectedPricing(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Pricing ▼</option>
            {pricingOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Niche Chips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" /> Explore by Niche
          </h2>
          {selectedNiche && (
            <button 
              onClick={() => setSelectedNiche("")} 
              className="text-xs text-blue-400 hover:underline"
            >
              Clear Niche Filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {niches.map((niche) => {
            const isSelected = selectedNiche === niche;
            return (
              <button
                key={niche}
                onClick={() => {
                  setSelectedNiche(isSelected ? "" : niche);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                {niche}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-white">{(page - 1) * 24 + 1}–{Math.min(page * 24, totalCount)}</span> of <span className="font-semibold text-white">{totalCount.toLocaleString()}</span> products
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-52 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => {
              const primaryNiche = product.categories?.[0]?.name || "AI Tool";
              const bm = product.business_models?.[0] || (product.open_source_status ? "B2B" : "B2C");
              const pricingTag = product.open_source_status ? "Open Source" : (product.free_plan_available ? "Freemium" : "Paid");

              return (
                <div 
                  key={product.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header with Logo + Name */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <ProductLogo 
                          name={product.name} 
                          officialUrl={product.official_url} 
                          logoUrl={product.logo_url}
                          productType={product.product_type}
                        />
                        <div>
                          <Link href={`/tools/${product.slug}`}>
                            <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-slate-400">
                            by <span className="text-slate-300 font-medium">{product.company_name}</span>
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[11px] font-semibold shrink-0">
                        {product.product_type}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 mt-3 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Metadata Badges */}
                    <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-1 text-slate-300 text-xs">
                        <Tag className="h-3 w-3 text-slate-400" />
                        <span>{primaryNiche}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                          {bm}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                          {pricingTag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <Link href={`/tools/${product.slug}`} className="text-xs text-slate-400 hover:text-white">
                      View Details
                    </Link>
                    <a
                      href={product.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
                    >
                      Visit Official Website <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Server-Side Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs text-slate-400 px-3">
              Page <span className="font-semibold text-white">{page}</span> of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
