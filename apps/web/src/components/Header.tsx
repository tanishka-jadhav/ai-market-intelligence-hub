"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Moon, Sun, CheckCircle2 } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AI agents, tools and providers..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-12 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
          ↵
        </kbd>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Freshness Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Data updated: Today</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800 transition-colors"
          title="Toggle theme"
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
        </button>
      </div>
    </header>
  );
}
