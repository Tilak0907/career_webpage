'use client';

import React, { useState, useEffect } from 'react';
import { Company, Role } from '@/types';
import {
  getCompanies, saveCompanies, getRoles, saveRoles,
  getPageViewCount, toggleRoleActiveStatus,
  deleteCompanyById, deleteRoleById, isAdminAuthenticated, setAdminAuthenticated
} from '@/lib/store';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Shield, Lock, User, CheckCircle2, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Admin Login Form State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Initial Data Load & Event Subscriptions
  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
    setCompanies(getCompanies());
    setRoles(getRoles());
    setViewerCount(getPageViewCount());

    const handleStoreUpdate = () => {
      setCompanies(getCompanies());
      setRoles(getRoles());
      setViewerCount(getPageViewCount());
      setIsAuthenticated(isAdminAuthenticated());
    };

    window.addEventListener('career_portal_store_updated', handleStoreUpdate);
    return () => {
      window.removeEventListener('career_portal_store_updated', handleStoreUpdate);
    };
  }, []);

  // Login Form Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'admin' || username === 'admin@careerlaunch.com') && (password === 'admin123' || password === 'admin')) {
      setLoginError('');
      setLoginSuccess(true);
      setTimeout(() => {
        setAdminAuthenticated(true);
        setIsAuthenticated(true);
        setLoginSuccess(false);
        setPassword('');
      }, 500);
    } else {
      setLoginError('Invalid admin credentials. Default password is: admin123');
    }
  };

  // Logout Action
  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
  };

  // Company Actions
  const handleAddCompany = (compData: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...compData,
      id: 'comp-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    saveCompanies([newCompany, ...companies]);
  };

  const handleUpdateCompany = (updatedComp: Company) => {
    saveCompanies(companies.map((c) => (c.id === updatedComp.id ? updatedComp : c)));
  };

  const handleDeleteCompany = (id: string) => {
    deleteCompanyById(id);
  };

  // Role Actions
  const handleAddRole = (roleData: Omit<Role, 'id' | 'applyCount' | 'viewCount' | 'createdAt'>) => {
    const newRole: Role = {
      ...roleData,
      id: 'role-' + Date.now(),
      applyCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
    };
    saveRoles([newRole, ...roles]);
  };

  const handleUpdateRole = (updatedRole: Role) => {
    saveRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
  };

  const handleToggleRoleActive = (id: string) => {
    toggleRoleActiveStatus(id);
  };

  const handleDeleteRole = (id: string) => {
    deleteRoleById(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header isAdminPage={true} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          /* DEDICATED ADMIN LOGIN PAGE */
          <div className="max-w-md mx-auto py-12 animate-in fade-in zoom-in-95 duration-200">
            <div className="glass-card rounded-3xl p-8 border border-indigo-500/30 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto shadow-lg shadow-indigo-500/10">
                  <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal Sign In</h1>
                <p className="text-xs text-slate-400">
                  Access employer management, role postings, analytics, and visitor counts.
                </p>
              </div>

              {/* Login Presets Callout */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
                <div className="font-semibold text-indigo-200">Default Credentials:</div>
                <div className="font-mono text-[11px] text-slate-300">
                  Username: <span className="text-indigo-300 font-bold">admin</span> | Password: <span className="text-indigo-300 font-bold">admin123</span>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                    {loginError}
                  </div>
                )}

                {loginSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Credentials verified! Opening dashboard...</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  Sign In to Admin Dashboard
                </button>
              </form>

              <div className="pt-2 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Public Student Portal</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* DEDICATED ADMIN DASHBOARD */
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-300 font-semibold">
                  Logged in as <strong className="text-indigo-300">Administrator</strong>
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-xl border border-rose-500/20 transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>

            <AdminDashboard
              companies={companies}
              roles={roles}
              viewerCount={viewerCount}
              onAddCompany={handleAddCompany}
              onUpdateCompany={handleUpdateCompany}
              onDeleteCompany={handleDeleteCompany}
              onAddRole={handleAddRole}
              onUpdateRole={handleUpdateRole}
              onToggleRoleActive={handleToggleRoleActive}
              onDeleteRole={handleDeleteRole}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
