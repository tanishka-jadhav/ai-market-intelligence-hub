import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'AI Market Intelligence Hub | Discover 10,000+ AI Tools, Agents & Models',
  description: 'Centralized enterprise platform cataloging verified AI tools, autonomous AI agents, LLMs, platforms, and SaaS products across B2B, B2C, and Enterprise.',
  keywords: ['AI Market Hub', 'AI Tools Directory', 'AI Agents', 'AI Models', 'LLM Comparison', 'Context Window', 'Anthropic Claude', 'ChatGPT', 'Gemini'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
