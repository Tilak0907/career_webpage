'use client';

import React, { useState } from 'react';
import { Company, Role } from '@/types';
import { Building2, MapPin, ChevronRight, Briefcase, Calendar, CheckCircle2, Sparkles, ExternalLink, Filter } from 'lucide-react';
import { RoleDetailModal } from './RoleDetailModal';

interface UserPortalProps {
  companies: Company[];
  roles: Role[];
  searchQuery: string;
  onRoleApplyClicked: (roleId: string) => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({
  companies,
  roles,
  searchQuery,
  onRoleApplyClicked,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('ALL');

  // Filter companies & roles based on search query and active status
  const filteredCompanies = companies.filter((c) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(q);
    const industryMatch = c.industry.toLowerCase().includes(q);
    const locationMatch = c.location.toLowerCase().includes(q);
    const hasMatchingRole = roles.some(
      (r) => r.companyId === c.id && r.isActive && (r.title.toLowerCase().includes(q) || r.department.toLowerCase().includes(q))
    );
    return nameMatch || industryMatch || locationMatch || hasMatchingRole;
  });

  const getCompanyRoles = (companyId: string) => {
    return roles.filter((r) => {
      if (r.companyId !== companyId) return false;
      if (!r.isActive) return false; // Show active roles to public users
      if (workTypeFilter !== 'ALL' && r.type !== workTypeFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    });
  };

  const selectedCompany = companies.find((c) => c.id === (selectedRole?.companyId || selectedCompanyId));

  return (
    <div className="space-y-10 py-6">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-950 p-8 md:p-12 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Discover Top Student & Career Opportunities</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Launch Your Future with Top Hiring Companies
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Browse verified companies, explore open internship and full-time positions, review rich job descriptions, and apply directly. No registration required.
          </p>
        </div>
      </section>

      {/* Filter & Work Type Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Hiring Companies ({filteredCompanies.length})</h2>
          <p className="text-xs text-slate-400">Click a company card to view its active roles</p>
        </div>

        {/* Work Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['ALL', 'Full-time', 'Internship', 'Remote'].map((type) => (
            <button
              key={type}
              onClick={() => setWorkTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                workTypeFilter === type
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {type === 'ALL' ? 'All Roles' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Company Grid & Roles List */}
      <div className="space-y-6">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16 glass-card p-8 space-y-3">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No Companies Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No hiring companies match your search criteria. Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          filteredCompanies.map((company) => {
            const companyActiveRoles = getCompanyRoles(company.id);
            const isSelected = selectedCompanyId === company.id;

            return (
              <div
                key={company.id}
                className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isSelected ? 'border-indigo-500/50 bg-slate-900/90 shadow-2xl ring-1 ring-indigo-500/30' : 'border-white/10'
                }`}
              >
                {/* Company Header Card */}
                <div
                  onClick={() => setSelectedCompanyId(isSelected ? null : company.id)}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-md bg-slate-950 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                        <Building2 className="w-7 h-7" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white tracking-tight">{company.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full badge-indigo font-medium">
                          {company.industry}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">{company.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {company.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                    <div className="text-left sm:text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{companyActiveRoles.length} Open {companyActiveRoles.length === 1 ? 'Role' : 'Roles'}</span>
                      </span>
                    </div>

                    <div className={`p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-indigo-400 bg-indigo-600/20' : ''}`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Expanded Roles Section */}
                {isSelected && (
                  <div className="border-t border-white/10 bg-slate-950/60 p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Available Career Positions at {company.name}
                      </h4>
                      {company.websiteUrl && (
                        <a
                          href={company.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <span>Visit Company Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {companyActiveRoles.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center border border-dashed border-white/10 rounded-xl">
                        No active roles currently open for this company matching your filter.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {companyActiveRoles.map((role) => (
                          <div
                            key={role.id}
                            onClick={() => {
                              setSelectedRole(role);
                              setIsRoleModalOpen(true);
                            }}
                            className="p-4 rounded-2xl bg-slate-900 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-medium text-indigo-400">{role.department}</span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-white/10">
                                  {role.type}
                                </span>
                              </div>
                              <h5 className="text-base font-bold text-white group-hover:text-indigo-300 transition mt-1">
                                {role.title}
                              </h5>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                {role.location}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1 text-slate-400">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                End Date: {role.endDate}
                              </span>
                              <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                                View Details & Apply <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Role Detail Modal */}
      <RoleDetailModal
        role={selectedRole}
        company={selectedCompany}
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onApplyClicked={onRoleApplyClicked}
      />
    </div>
  );
};
