'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Collapsible Left Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div
        className={`flex-grow flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        <Header onToggleSidebar={() => setCollapsed(!collapsed)} />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
