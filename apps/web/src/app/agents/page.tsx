"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, ExternalLink, Search, Tag } from "lucide-react";

interface AgentItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  company_name: string;
  official_url: string;
  open_source_status: boolean;
  free_plan_available: boolean;
  categories: { id: string; name: string }[];
  business_models: string[];
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedBM, setSelectedBM] = useState("");

  const niches = ["Automation", "Coding", "Customer Support", "Research", "Sales", "Workflow"];
  const businessModels = ["B2B", "B2C", "C2C", "D2C"];

  useEffect(() => {
    async function fetchAgents() {
      setLoading(true);
      try {
        let url = `http://127.0.0.1:8000/api/v1/products?product_type=AI+Agent&limit=50`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (selectedNiche) url += `&category=${encodeURIComponent(selectedNiche)}`;
        if (selectedBM) url += `&business_model=${encodeURIComponent(selectedBM)}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setAgents(data.items || []);
        }
      } catch (err) {
        console.error("Error fetching agents:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, [search, selectedNiche, selectedBM]);

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AI Agents</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Discover autonomous AI agents for business, productivity, automation and specialized tasks.
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
            placeholder="Search AI agents..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedNiche}
          onChange={(e) => setSelectedNiche(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">All Agent Niches ▼</option>
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
            <div key={i} className="h-44 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                    AI Agent
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                    {agent.business_models?.[0] || "B2B"}
                  </span>
                </div>

                <Link href={`/tools/${agent.slug}`}>
                  <h3 className="font-bold text-white text-lg mt-3 group-hover:text-emerald-400 transition-colors">
                    {agent.name}
                  </h3>
                </Link>

                <p className="text-xs text-slate-400 mt-0.5">
                  by <span className="text-slate-300 font-medium">{agent.company_name}</span>
                </p>

                <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {agent.description}
                </p>

                <div className="mt-3 flex items-center gap-1.5">
                  <Tag className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium">{agent.categories?.[0]?.name || "Autonomous Agents"}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link href={`/tools/${agent.slug}`} className="text-xs text-slate-400 hover:text-white">
                  Details
                </Link>
                <a
                  href={agent.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
                >
                  Visit Agent <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
