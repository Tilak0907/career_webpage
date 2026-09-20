'use client';

import React from 'react';
import { Briefcase, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  isAdminPage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  setSearchQuery,
  isAdminPage = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Portal Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                CareerLaunch
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-2.5 h-2.5" /> {isAdminPage ? 'Admin' : 'Portal'}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {isAdminPage ? 'Employer & Opportunity Controls' : 'Empowering Students & Top Talent'}
            </p>
          </div>
        </Link>

        {/* Global Search Bar (Only shown on User Portal page) */}
        {!isAdminPage && setSearchQuery && (
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies, roles, or skills..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        )}

        {/* Right Section Actions - Clean User View with no Admin Login button */}
        {isAdminPage && (
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Back to Public Portal</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
