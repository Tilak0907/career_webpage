'use client';

import React, { useState } from 'react';
import { Company, Role } from '@/types';
import { Building2, MapPin, ChevronRight, Briefcase, Calendar, Sparkles, ExternalLink, Filter, Search } from 'lucide-react';
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
      if (!r.isActive) return false;
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
    <div className="space-y-6 sm:space-y-10 py-4 sm:py-8">
      {/* Light Cream Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#f5efe6] via-white to-[#faf6f0] p-6 sm:p-10 border border-[#ebdcc9] shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-[#ebdcc9] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Discover Top Student & Career Opportunities</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Launch Your Future with Top Hiring Companies
          </h1>
          <p className="text-slate-700 text-xs sm:text-base leading-relaxed">
            Browse verified hiring companies, explore open internship and full-time positions, review formatted descriptions, and apply directly. No registration required.
          </p>
        </div>
      </section>

      {/* Filter & Work Type Selector Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-[#ebdcc9]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Hiring Companies ({filteredCompanies.length})
          </h2>
          <p className="text-xs text-slate-600">Tap a company card to expand open positions</p>
        </div>

        {/* Work Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-600 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-700" /> Filter:
          </span>
          {['ALL', 'Full-time', 'Internship', 'Remote'].map((type) => (
            <button
              key={type}
              onClick={() => setWorkTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer ${
                workTypeFilter === type
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border border-indigo-700'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-[#ebdcc9] hover:bg-[#f5efe6]'
              }`}
            >
              {type === 'ALL' ? 'All Roles' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Company Grid & Roles Accordion */}
      <div className="space-y-4 sm:space-y-6">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12 sm:py-16 cream-card p-6 sm:p-8 space-y-3">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-slate-800">No Companies Found</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
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
                className={`cream-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isSelected ? 'border-amber-500/60 bg-white ring-2 ring-amber-500/20 shadow-md' : 'border-[#ebdcc9] bg-white'
                }`}
              >
                {/* Company Card Header */}
                <div
                  onClick={() => setSelectedCompanyId(isSelected ? null : company.id)}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-[#faf6f0]/80 transition"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-[#ebdcc9] shadow-xs bg-[#faf6f0] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 border border-[#ebdcc9] flex items-center justify-center text-amber-800 shrink-0">
                        <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                          {company.name}
                        </h3>
                        <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-900 border border-[#ebdcc9] font-semibold">
                          {company.industry}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 line-clamp-2 sm:line-clamp-1 mt-0.5 sm:mt-1">
                        {company.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1 text-[11px] sm:text-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {company.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-[#ebdcc9] shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 text-xs font-semibold border border-[#ebdcc9]">
                      <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                      <span>{companyActiveRoles.length} {companyActiveRoles.length === 1 ? 'Role' : 'Roles'}</span>
                    </span>

                    <div className={`p-1.5 sm:p-2 rounded-xl bg-[#f5efe6] border border-[#ebdcc9] text-slate-600 transition-transform ${isSelected ? 'rotate-90 text-amber-800 bg-amber-100 border-amber-300' : ''}`}>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>

                {/* Expanded Roles Accordion Panel */}
                {isSelected && (
                  <div className="border-t border-[#ebdcc9] bg-[#faf6f0]/70 p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Open Positions at {company.name}
                      </h4>
                      {company.websiteUrl && (
                        <a
                          href={company.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Company Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {companyActiveRoles.length === 0 ? (
                      <p className="text-xs text-slate-600 italic py-4 text-center border border-dashed border-[#ebdcc9] rounded-xl bg-white">
                        No active roles open for this company matching your filter.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {companyActiveRoles.map((role) => (
                          <div
                            key={role.id}
                            onClick={() => {
                              setSelectedRole(role);
                              setIsRoleModalOpen(true);
                            }}
                            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#ebdcc9] hover:border-amber-500/70 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-2.5"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-indigo-700">{role.department}</span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f5efe6] text-slate-800 border border-[#ebdcc9]">
                                  {role.type}
                                </span>
                              </div>
                              <h5 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-700 transition mt-1 leading-snug">
                                {role.title}
                              </h5>
                              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                {role.location}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-[#ebdcc9] flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1 text-slate-600 text-[11px]">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                End: {role.endDate}
                              </span>
                              <span className="text-indigo-700 font-bold group-hover:translate-x-0.5 transition flex items-center gap-0.5 text-xs">
                                View Details <ChevronRight className="w-3.5 h-3.5" />
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
