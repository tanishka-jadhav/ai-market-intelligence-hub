"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Bot, 
  Wrench, 
  Building2, 
  Sparkles,
  Info,
  CheckCircle2
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "AI Agents", href: "/agents", icon: Bot },
    { name: "AI Tools", href: "/explore", icon: Wrench },
    { name: "Providers", href: "/providers", icon: Building2 },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight leading-none text-base">AI MARKET HUB</h1>
          <p className="text-[11px] text-blue-400 font-medium mt-1">AI Discovery Platform</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Directory
        </p>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Data Updated
          </span>
          <span className="text-emerald-400 font-medium">Today</span>
        </div>
        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>AI Discovery Platform</span>
          <Link href="/about" className="hover:underline flex items-center gap-1">
            <Info className="h-3 w-3" /> About
          </Link>
        </div>
      </div>
    </aside>
  );
}
