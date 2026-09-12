'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bot, ShieldCheck, Globe, Code, Monitor, Users, Zap, Check, X, ArrowRight, ExternalLink } from 'lucide-react';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');

  const categories = [
    'All',
    'Coding Agents',
    'Research Agents',
    'Automation Agents',
    'Enterprise Agents',
    'Sales Agents',
    'Support Agents'
  ];

  useEffect(() => {
    async function loadAgents() {
      setLoading(true);
      const res = await fetchProducts({ product_type: 'AI Agent', limit: 20 });
      setAgents(res.products);
      setLoading(false);
    }
    loadAgents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold">
          <Bot className="w-4 h-4 text-purple-400" />
          <span>AUTONOMOUS AGENTS MATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          AI Agent Directory & Autonomy Catalog
        </h1>
        <p className="text-sm text-gray-300">
          Discover autonomous AI agents classified by autonomy levels (1-5), web browsing capabilities, sandbox code execution, desktop computer use, and multi-agent delegation frameworks.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedSubCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedSubCategory === cat
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'glass-panel text-gray-300 hover:bg-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Agents Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">Loading AI Agents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const caps = agent.agent_capabilities || {
              autonomy_level: agent.autonomy_level || 3,
              web_browsing: true,
              code_execution: true,
              computer_use: false,
              multi_agent: true,
              workflow_automation: true,
              memory_type: 'Vector Store Memory',
              human_approval_required: true
            };

            return (
              <div
                key={agent.id}
                className="glass-panel glass-panel-hover rounded-2xl p-6 border border-gray-800 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white">{agent.name}</h3>
                      <p className="text-xs text-gray-400 font-medium">{agent.company_name}</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      Level {caps.autonomy_level} Autonomy
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{agent.tagline || agent.description}</p>

                  {/* Capability Checklist Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-2 border-t border-gray-800">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Globe className={`w-3.5 h-3.5 ${caps.web_browsing ? 'text-emerald-400' : 'text-gray-600'}`} />
                      <span>Web Browsing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Code className={`w-3.5 h-3.5 ${caps.code_execution ? 'text-emerald-400' : 'text-gray-600'}`} />
                      <span>Code Sandbox</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Monitor className={`w-3.5 h-3.5 ${caps.computer_use ? 'text-emerald-400' : 'text-gray-600'}`} />
                      <span>Computer Use</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Users className={`w-3.5 h-3.5 ${caps.multi_agent ? 'text-emerald-400' : 'text-gray-600'}`} />
                      <span>Multi-Agent</span>
                    </div>
                  </div>

                  {/* Memory Type */}
                  <div className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 text-[11px] font-mono text-gray-400">
                    <span>Memory: </span>
                    <strong className="text-purple-300">{caps.memory_type || 'Workspace Memory'}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-800">
                  <Link
                    href={`/tools/${agent.slug}`}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-center bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700"
                  >
                    VIEW SPECS
                  </Link>
                  <a
                    href={`/api/v1/redirect?product_id=${agent.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-center bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center space-x-1 shadow-lg shadow-purple-600/20"
                  >
                    <span>OFFICIAL SITE</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
