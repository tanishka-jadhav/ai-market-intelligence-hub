'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cpu, ShieldCheck, Check, ExternalLink, Sparkles, Layers, Eye, Mic, Video, Wrench, Brain } from 'lucide-react';
import { fetchModels } from '@/lib/api';
import { AIModel } from '@/types';

export default function ModelsPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModelsData() {
      setLoading(true);
      const res = await fetchModels();
      setModels(res);
      setLoading(false);
    }
    loadModelsData();
  }, []);

  const formatContext = (tokens?: number) => {
    if (!tokens) return 'Not publicly specified';
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M tokens`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}k tokens`;
    return `${tokens} tokens`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>FOUNDATION & SLM DATABASE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          AI Model Registry & Token Pricing Matrix
        </h1>
        <p className="text-sm text-gray-300">
          Factual technical specifications for foundation models. Includes verified context windows, input/output token pricing per 1M tokens, vision/multimodal support, and developer API references.
        </p>
      </div>

      {/* Models Table */}
      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">Loading AI Model Registry...</div>
      ) : (
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/90 border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider font-mono">
                  <th className="p-4">Model Name</th>
                  <th className="p-4">Family</th>
                  <th className="p-4">Context Window</th>
                  <th className="p-4">Input Price (1M)</th>
                  <th className="p-4">Output Price (1M)</th>
                  <th className="p-4">Modalities & Capabilities</th>
                  <th className="p-4 text-right">Official Docs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-xs font-medium text-gray-200">
                {models.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span>{model.name}</span>
                    </td>
                    <td className="p-4 font-mono text-gray-400">{model.model_family || 'Foundation'}</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">
                      {formatContext(model.context_window)}
                    </td>
                    <td className="p-4 font-mono text-blue-400">
                      {model.input_price_per_1m != null ? `$${model.input_price_per_1m.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="p-4 font-mono text-purple-400">
                      {model.output_price_per_1m != null ? `$${model.output_price_per_1m.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {model.supports_text && <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300">Text</span>}
                        {model.supports_vision && <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 flex items-center gap-1"><Eye className="w-3 h-3" /> Vision</span>}
                        {model.supports_audio && <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 flex items-center gap-1"><Mic className="w-3 h-3" /> Audio</span>}
                        {model.supports_reasoning && <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 flex items-center gap-1"><Brain className="w-3 h-3" /> Reasoning</span>}
                        {model.supports_tool_calling && <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1"><Wrench className="w-3 h-3" /> Tools</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {model.official_docs_url ? (
                        <a
                          href={model.official_docs_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          <span>Docs</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
