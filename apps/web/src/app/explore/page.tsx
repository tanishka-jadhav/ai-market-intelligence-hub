"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wrench, ExternalLink, Search, Tag } from "lucide-react";
import { ProductLogo } from "@/components/ProductLogo";

interface ToolItem {
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

export default function ExploreToolsPage() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedBM, setSelectedBM] = useState("");

  const niches = ["Development", "Marketing", "Writing", "Design", "Video", "Productivity", "SEO", "Sales"];
  const businessModels = ["B2B", "B2C", "C2C", "D2C"];

  useEffect(() => {
    async function fetchTools() {
      setLoading(true);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      try {
        let url = `${apiBase}/api/v1/products?limit=60`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (selectedNiche) url += `&category=${encodeURIComponent(selectedNiche)}`;
        if (selectedBM) url += `&business_model=${encodeURIComponent(selectedBM)}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setTools(data.products || data.items || []);
        }
      } catch (err) {
        console.error("Error fetching tools:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, [search, selectedNiche, selectedBM]);

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AI Tools Catalog</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Explore thousands of AI tools across writing, coding, marketing, design, video, and productivity.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI tools..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedNiche}
          onChange={(e) => setSelectedNiche(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">All Tool Niches ▼</option>
          {niches.map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <select
          value={selectedBM}
          onChange={(e) => setSelectedBM(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Business Model ▼</option>
          {businessModels.map(bm => <option key={bm} value={bm}>{bm}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ProductLogo 
                      name={tool.name} 
                      officialUrl={tool.official_url} 
                      logoUrl={tool.logo_url}
                      productType={tool.product_type}
                    />
                    <div>
                      <Link href={`/tools/${tool.slug}`}>
                        <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors line-clamp-1">
                          {tool.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-400">
                        by <span className="text-slate-300 font-medium">{tool.company_name}</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600/10 text-purple-400 border border-purple-500/20 text-[11px] font-semibold shrink-0">
                    {tool.product_type}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mt-3 leading-relaxed">
                  {tool.description}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-1 text-slate-300 text-xs">
                    <Tag className="h-3 w-3 text-slate-400" />
                    <span>{tool.categories?.[0]?.name || "Developer Tools"}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                    {tool.business_models?.[0] || "B2B"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <Link href={`/tools/${tool.slug}`} className="text-xs text-slate-400 hover:text-white">
                  View Details
                </Link>
                <a
                  href={tool.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
                >
                  Visit Website <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
