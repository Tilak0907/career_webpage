'use client';

import React, { useState, useEffect } from 'react';
import { Company, Role } from '@/types';
import {
  getCompanies, getRoles, saveRoles,
  incrementPageViewCount, getPageViewCount
} from '@/lib/store';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UserPortal } from '@/components/UserPortal';

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Track site visits automatically in background (recorded for Admin Dashboard)
  useEffect(() => {
    incrementPageViewCount();
    setCompanies(getCompanies());
    setRoles(getRoles());

    const handleStoreUpdate = () => {
      setCompanies(getCompanies());
      setRoles(getRoles());
    };

    window.addEventListener('career_portal_store_updated', handleStoreUpdate);
    return () => {
      window.removeEventListener('career_portal_store_updated', handleStoreUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f0] text-slate-900 selection:bg-amber-600 selection:text-white">
      {/* Public Header without Visitor Count */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdminPage={false}
      />

      {/* Public Student Portal Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <UserPortal
          companies={companies}
          roles={roles}
          searchQuery={searchQuery}
          onRoleApplyClicked={() => {
            setRoles(getRoles());
          }}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
