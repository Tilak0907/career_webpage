'use client';

import React from 'react';
import { Briefcase, Heart, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#ebdcc9] bg-[#faf6f0] text-slate-700 mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">CareerConnect</span>
            </div>
            <p className="text-xs text-slate-700 max-w-sm leading-relaxed">
              Connecting students and job seekers directly with hiring companies, internship opportunities, and full-time career roles across technology, AI, and software engineering.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Employer Opportunities & Real-Time Analytics</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li><Link href="/" className="hover:text-indigo-700 transition">Featured Companies</Link></li>
              <li><Link href="/" className="hover:text-indigo-700 transition">Explore Open Roles</Link></li>
              <li><Link href="/admin" className="hover:text-indigo-700 transition">Employer Admin Portal</Link></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-1">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-indigo-700 transition">LinkedIn Career Tips</a>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center gap-1">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-700 transition">Student Project Showcase</a>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li><span className="text-slate-500">Privacy & Terms</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-[#ebdcc9] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <p>© 2026 CareerConnect Opportunities Portal. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-600">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for students & job seekers globally</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
