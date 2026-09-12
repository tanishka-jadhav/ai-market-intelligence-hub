'use client';

import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, ShieldCheck, Menu, User, Sparkles } from 'lucide-react';
import SearchModal from './SearchModal';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 w-full glass-panel border-b border-gray-800 px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Sidebar Toggle & Search Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Trigger Input */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700 transition-all w-64 sm:w-80 shadow-inner"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-medium truncate">Search AI tools, agents, platforms...</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded ml-auto">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls: Freshness, Theme, Notifications, User */}
        <div className="flex items-center space-x-3">
          
          {/* Data Freshness Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data updated: Today</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Notification Bell */}
          <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-md">
            A
          </div>

        </div>

      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
