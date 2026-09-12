'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Bot, Wrench, Layers, Cpu, Building2, Database, 
  Tag, Clock, GitCompare, Bookmark, Server, RefreshCw, AlertTriangle, 
  Copy, Shield, Settings, Activity, User, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const mainNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'AI Agents', href: '/agents', icon: Bot },
    { name: 'AI Tools', href: '/explore?product_type=AI+Tool', icon: Wrench },
    { name: 'AI Platforms', href: '/explore?product_type=AI+Platform', icon: Layers },
    { name: 'AI Models', href: '/models', icon: Cpu },
    { name: 'Categories', href: '/categories', icon: Database },
    { name: 'Industries', href: '/industries', icon: Tag },
    { name: 'Compare Workspace', href: '/compare', icon: GitCompare },
    { name: 'Recently Updated', href: '/trending', icon: Clock },
  ];

  const managementNavigation = [
    { name: 'Data Ingestion', href: '/admin', icon: Server },
    { name: 'Update Monitor', href: '/admin', icon: RefreshCw },
    { name: 'Duplicates Queue', href: '/admin', icon: Copy },
    { name: 'Admin Governance', href: '/admin', icon: Shield },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 bg-gray-950 border-r border-gray-800 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <Link href="/" className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-bold text-sm text-white tracking-tight block">AI MARKET HUB</span>
                <span className="text-[10px] text-gray-400 font-mono block">Enterprise Intelligence</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 hidden lg:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="space-y-1">
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 block mb-2">
                Navigation
              </span>
            )}
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-blue-400" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Management Navigation */}
          <div className="space-y-1 pt-3 border-t border-gray-800/80">
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 block mb-2">
                Management
              </span>
            )}
            {managementNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-gray-500" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-gray-800 bg-gray-950 space-y-2">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
              Pipeline: Active
            </span>
            <span className="text-[10px] text-gray-500">v1.0</span>
          </div>
        )}

        <div className="flex items-center space-x-3 px-2 py-1.5 rounded-xl hover:bg-gray-900 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="truncate text-xs">
              <span className="font-semibold text-white block truncate">Admin User</span>
              <span className="text-[10px] text-gray-400 block truncate">SuperAdmin Access</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
