'use client';

import React, { useState } from 'react';
import { Briefcase, Search, Sparkles, X } from 'lucide-react';
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ebdcc9] bg-[#faf6f0]/95 backdrop-blur-md shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Logo & Portal Title */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 p-[1px] shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#faf6f0] rounded-[11px] flex items-center justify-center">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1c1917]">
                CareerConnect
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                <Sparkles className="w-2.5 h-2.5" /> {isAdminPage ? 'Admin' : 'Portal'}
              </span>
            </div>
            <p className="text-[11px] text-[#78716c] hidden sm:block">
              {isAdminPage ? 'Employer & Opportunity Controls' : 'Discover Student & Career Opportunities'}
            </p>
          </div>
        </Link>

        {/* Global Search Bar (Shown on User Portal page) */}
        {!isAdminPage && setSearchQuery && (
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            {/* Desktop Search Input */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies, roles, or skills..."
                className="w-full pl-10 pr-4 py-2 bg-[#f5efe6] text-xs sm:text-sm text-[#1c1917] placeholder-[#a8a29e] rounded-xl border border-[#ebdcc9] focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#1c1917]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle Icon */}
            <div className="md:hidden flex justify-end">
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 text-[#44403c] hover:text-indigo-600 rounded-xl bg-[#f5efe6] border border-[#ebdcc9]"
                aria-label="Toggle mobile search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Right Section Actions */}
        {isAdminPage && (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-xl bg-[#f5efe6] hover:bg-[#ebdcc9] text-[#44403c] border border-[#ebdcc9] transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Back to</span> Portal
            </Link>
          </div>
        )}
      </div>

      {/* Expanded Mobile Search Input Drawer */}
      {!isAdminPage && setSearchQuery && isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#ebdcc9] bg-[#faf6f0] animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies or job roles..."
              autoFocus
              className="w-full pl-10 pr-9 py-2.5 bg-[#f5efe6] text-sm text-[#1c1917] rounded-xl border border-[#ebdcc9] focus:outline-none focus:border-indigo-600"
            />
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#1c1917]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
