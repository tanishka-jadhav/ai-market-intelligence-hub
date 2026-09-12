'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, Cpu, Bot, Wrench, Layers, Database, GitCompare, TrendingUp, 
  Clock, CheckCircle, Lock, Menu, X, Sparkles 
} from 'lucide-react';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Explore', href: '/explore', icon: Sparkles },
    { name: 'AI Agents', href: '/agents', icon: Bot },
    { name: 'AI Tools', href: '/explore?product_type=AI+Tool', icon: Wrench },
    { name: 'AI Platforms', href: '/explore?product_type=AI+Platform', icon: Layers },
    { name: 'AI Models', href: '/models', icon: Cpu },
    { name: 'Compare', href: '/compare', icon: GitCompare },
    { name: 'Trending', href: '/trending', icon: TrendingUp },
    { name: 'Categories', href: '/categories', icon: Database },
    { name: 'Admin', href: '/admin', icon: Lock },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                AI MARKET HUB
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">10k+</span>
              </span>
              <span className="text-xs text-gray-400 block -mt-1 font-mono">Verified Market Intelligence</span>
            </div>
          </Link>

          {/* Center Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700 transition-all w-80 shadow-inner"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">Search 10,000+ AI tools, agents, models...</span>
            <kbd className="text-[10px] font-mono bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded ml-auto">⌘K</kbd>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.slice(0, 6).map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            <Link
              href="/admin"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-all flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-gray-800 px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-800"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
