'use client';

import React from 'react';
import { Briefcase, Heart, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/90 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">CareerLaunch</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Connecting students and job seekers directly with industry-leading companies, internship opportunities, and full-time career roles across tech, AI, and green energy.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Employer Opportunities & Real-Time Tracking</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#companies" className="hover:text-indigo-400 transition">Featured Companies</a></li>
              <li><a href="#roles" className="hover:text-indigo-400 transition">Explore Open Roles</a></li>
              <li><a href="#admin" className="hover:text-indigo-400 transition">Admin Opportunities Management</a></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1"><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition">LinkedIn Career Tips</a> <ExternalLink className="w-3 h-3 text-slate-500" /></li>
              <li className="flex items-center gap-1"><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition">Student Project Portfolio</a> <ExternalLink className="w-3 h-3 text-slate-500" /></li>
              <li><span className="text-slate-500">Privacy & Terms</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CareerLaunch Opportunities Portal. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for students & job seekers globally</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
