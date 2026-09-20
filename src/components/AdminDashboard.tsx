'use client';

import React, { useState } from 'react';
import { Company, Role, Attachment, WorkType } from '@/types';
import {
  Eye, MousePointerClick, Building2, Briefcase, Plus, Trash2, Edit2, CheckCircle2,
  AlertTriangle, ToggleLeft, ToggleRight, Calendar, Link as LinkIcon, Upload, Search, X, Sparkles, FileText, Globe, MapPin
} from 'lucide-react';
import { CKEditorWrapper } from './CKEditorWrapper';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AdminDashboardProps {
  companies: Company[];
  roles: Role[];
  viewerCount: number;
  onAddCompany: (c: Omit<Company, 'id' | 'createdAt'>) => void;
  onUpdateCompany: (c: Company) => void;
  onDeleteCompany: (id: string) => void;
  onAddRole: (r: Omit<Role, 'id' | 'applyCount' | 'viewCount' | 'createdAt'>) => void;
  onUpdateRole: (r: Role) => void;
  onToggleRoleActive: (id: string) => void;
  onDeleteRole: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  companies,
  roles,
  viewerCount,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
  onAddRole,
  onUpdateRole,
  onToggleRoleActive,
  onDeleteRole,
}) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'companies' | 'analytics'>('roles');

  // Company Form Modal State
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyWebsiteUrl, setCompanyWebsiteUrl] = useState('');

  // Role Form Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleCompanyId, setRoleCompanyId] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDepartment, setRoleDepartment] = useState('');
  const [roleLocation, setRoleLocation] = useState('');
  const [roleType, setRoleType] = useState<WorkType>('Full-time');
  const [roleStartDate, setRoleStartDate] = useState('');
  const [roleEndDate, setRoleEndDate] = useState('');
  const [roleIsActive, setRoleIsActive] = useState(true);
  const [roleApplyUrl, setRoleApplyUrl] = useState('');
  const [roleDescriptionHtml, setRoleDescriptionHtml] = useState('');
  const [roleAttachments, setRoleAttachments] = useState<Attachment[]>([]);

  // Delete Confirm Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'company' | 'role';
    id: string;
    name: string;
    message?: string;
  }>({ isOpen: false, type: 'company', id: '', name: '' });

  // Open Company Form Modal
  const handleOpenCompanyModal = (comp?: Company) => {
    if (comp) {
      setEditingCompany(comp);
      setCompanyName(comp.name);
      setCompanyLogoUrl(comp.logoUrl);
      setCompanyIndustry(comp.industry);
      setCompanyLocation(comp.location);
      setCompanyDescription(comp.description);
      setCompanyWebsiteUrl(comp.websiteUrl || '');
    } else {
      setEditingCompany(null);
      setCompanyName('');
      setCompanyLogoUrl('');
      setCompanyIndustry('Technology & Software');
      setCompanyLocation('');
      setCompanyDescription('');
      setCompanyWebsiteUrl('');
    }
    setIsCompanyModalOpen(true);
  };

  // Submit Company Form
  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    if (editingCompany) {
      onUpdateCompany({
        ...editingCompany,
        name: companyName,
        logoUrl: companyLogoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        industry: companyIndustry,
        location: companyLocation,
        description: companyDescription,
        websiteUrl: companyWebsiteUrl,
      });
    } else {
      onAddCompany({
        name: companyName,
        logoUrl: companyLogoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        industry: companyIndustry,
        location: companyLocation,
        description: companyDescription,
        websiteUrl: companyWebsiteUrl,
      });
    }
    setIsCompanyModalOpen(false);
  };

  // Open Role Form Modal
  const handleOpenRoleModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setRoleCompanyId(role.companyId);
      setRoleTitle(role.title);
      setRoleDepartment(role.department);
      setRoleLocation(role.location);
      setRoleType(role.type);
      setRoleStartDate(role.startDate);
      setRoleEndDate(role.endDate);
      setRoleIsActive(role.isActive);
      setRoleApplyUrl(role.applyUrl);
      setRoleDescriptionHtml(role.descriptionHtml);
      setRoleAttachments(role.attachments || []);
    } else {
      setEditingRole(null);
      setRoleCompanyId(companies[0]?.id || '');
      setRoleTitle('');
      setRoleDepartment('');
      setRoleLocation('');
      setRoleType('Full-time');
      const today = new Date().toISOString().split('T')[0];
      const future = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setRoleStartDate(today);
      setRoleEndDate(future);
      setRoleIsActive(true);
      setRoleApplyUrl('');
      setRoleDescriptionHtml('<h3>Role Overview</h3><p>Describe job responsibilities and candidate qualifications...</p>');
      setRoleAttachments([]);
    }
    setIsRoleModalOpen(true);
  };

  // Submit Role Form
  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim() || !roleCompanyId) return;

    if (editingRole) {
      onUpdateRole({
        ...editingRole,
        companyId: roleCompanyId,
        title: roleTitle,
        department: roleDepartment,
        location: roleLocation,
        type: roleType,
        startDate: roleStartDate,
        endDate: roleEndDate,
        isActive: roleIsActive,
        applyUrl: roleApplyUrl,
        descriptionHtml: roleDescriptionHtml,
        attachments: roleAttachments,
      });
    } else {
      onAddRole({
        companyId: roleCompanyId,
        title: roleTitle,
        department: roleDepartment,
        location: roleLocation,
        type: roleType,
        startDate: roleStartDate,
        endDate: roleEndDate,
        isActive: roleIsActive,
        applyUrl: roleApplyUrl,
        descriptionHtml: roleDescriptionHtml,
        attachments: roleAttachments,
      });
    }
    setIsRoleModalOpen(false);
  };

  // Total application clicks aggregation
  const totalApplicationClicks = roles.reduce((sum, r) => sum + (r.applyCount || 0), 0);
  const activeRolesCount = roles.filter((r) => r.isActive).length;

  return (
    <div className="space-y-8 py-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full badge-indigo text-xs font-bold uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
            Career Opportunities Management
          </h1>
          <p className="text-xs text-slate-400">
            Manage hiring companies, post open roles, edit CKEditor descriptions, set active toggles, and track applicant clicks.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenCompanyModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-white/10 transition cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Add Company</span>
          </button>
          <button
            onClick={() => handleOpenRoleModal()}
            disabled={companies.length === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg transition cursor-pointer ${
              companies.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Post New Role</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Visitor & Page View Counter */}
        <div className="glass-card p-5 border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Site Visitor Count</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">{viewerCount.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Total Views</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Real-time tracked user webpage visits
          </p>
        </div>

        {/* Metric 2: Applicant Clicks */}
        <div className="glass-card p-5 border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Application Link Clicks</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">{totalApplicationClicks.toLocaleString()}</span>
            <span className="text-[10px] text-indigo-400 font-semibold">Total clicks</span>
          </div>
          <p className="text-[11px] text-slate-400">Tracked when candidates click Apply</p>
        </div>

        {/* Metric 3: Total Companies */}
        <div className="glass-card p-5 border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Companies</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">{companies.length}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Registered</span>
          </div>
          <p className="text-[11px] text-slate-400">Hiring employer profiles</p>
        </div>

        {/* Metric 4: Total & Active Roles */}
        <div className="glass-card p-5 border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Career Roles</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">{roles.length}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">{activeRolesCount} active</span>
          </div>
          <p className="text-[11px] text-slate-400">Active vs inactive postings</p>
        </div>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'roles'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Role Postings ({roles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'companies'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Companies ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <MousePointerClick className="w-4 h-4" />
          <span>Application Click Tracker</span>
        </button>
      </div>

      {/* TAB 1: ROLES MANAGEMENT */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          {roles.length === 0 ? (
            <div className="text-center py-16 glass-card p-8 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">No Career Roles Posted Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Start by creating a company, then click &quot;Post New Role&quot; to add job titles, start/end dates, CKEditor descriptions, and apply links.
              </p>
              <button
                onClick={() => handleOpenRoleModal()}
                disabled={companies.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post First Role</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {roles.map((role) => {
                const comp = companies.find((c) => c.id === role.companyId);
                return (
                  <div
                    key={role.id}
                    className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/30 transition"
                  >
                    <div className="flex items-start gap-4">
                      {comp?.logoUrl ? (
                        <img
                          src={comp.logoUrl}
                          alt={comp.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-slate-950 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-white">{role.title}</h4>
                          <span className="text-xs font-semibold text-indigo-400">@{comp?.name || 'Company'}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-white/10">
                            {role.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {role.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                            Dates: {role.startDate} to {role.endDate}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <MousePointerClick className="w-3.5 h-3.5" />
                            {role.applyCount} Applicant Clicks
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Controls: Active Switch & Action Buttons */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                      {/* Active / Inactive Toggle Switch */}
                      <button
                        onClick={() => onToggleRoleActive(role.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                          role.isActive
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                        title="Toggle role active/inactive status"
                      >
                        {role.isActive ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-rose-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenRoleModal(role)}
                          className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 transition cursor-pointer"
                          title="Edit Role Details & CKEditor Description"
                        >
                          <Edit2 className="w-4 h-4 text-indigo-400" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModalState({
                              isOpen: true,
                              type: 'role',
                              id: role.id,
                              name: role.title,
                              message: `Deletes "${role.title}" role posting permanently.`,
                            })
                          }
                          className="p-2 text-slate-300 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/10 rounded-xl border border-white/10 transition cursor-pointer"
                          title="Delete Role with Modal Confirmation"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPANIES MANAGEMENT */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map((company) => {
              const companyRolesCount = roles.filter((r) => r.companyId === company.id).length;
              return (
                <div key={company.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-slate-950"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-bold text-white">{company.name}</h4>
                        <span className="text-xs text-indigo-400">{company.industry}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenCompanyModal(company)}
                        className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 transition cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 text-indigo-400" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModalState({
                            isOpen: true,
                            type: 'company',
                            id: company.id,
                            name: company.name,
                            message: `Deleting "${company.name}" will also delete its ${companyRolesCount} open role postings.`,
                          })
                        }
                        className="p-2 text-slate-300 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/10 rounded-xl border border-white/10 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{company.description}</p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {company.location}
                    </span>
                    <span className="font-semibold text-indigo-300">
                      {companyRolesCount} Open Positions
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & APPLICATION TRACKER TABLE */}
      {activeTab === 'analytics' && (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Application Link Click Tracking</h3>
              <p className="text-xs text-slate-400">View exact count of candidates who clicked apply per role</p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Total Visitors: {viewerCount}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Role & Company</th>
                  <th className="py-3.5 px-4">Work Type</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Applicant Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {roles.map((role) => {
                  const comp = companies.find((c) => c.id === role.companyId);
                  return (
                    <tr key={role.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div>{role.title}</div>
                        <div className="text-[11px] text-indigo-400">{comp?.name || 'Company'}</div>
                      </td>
                      <td className="py-3.5 px-4">{role.type}</td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {role.startDate} to {role.endDate}
                      </td>
                      <td className="py-3.5 px-4">
                        {role.isActive ? (
                          <span className="px-2 py-0.5 rounded-full badge-emerald font-semibold">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full badge-rose font-semibold">Inactive</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400 text-sm">
                        {role.applyCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT COMPANY FORM */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg glass-modal rounded-3xl p-6 border border-white/10 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsCompanyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">
              {editingCompany ? 'Edit Company Profile' : 'Register New Company'}
            </h3>

            <form onSubmit={handleCompanySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. TechNova Solutions"
                  className="w-full px-3.5 py-2 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    value={companyIndustry}
                    onChange={(e) => setCompanyIndustry(e.target.value)}
                    placeholder="e.g. Artificial Intelligence"
                    className="w-full px-3.5 py-2 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3.5 py-2 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Logo Image URL</label>
                <input
                  type="url"
                  value={companyLogoUrl}
                  onChange={(e) => setCompanyLogoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Description</label>
                <textarea
                  rows={3}
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="Brief overview of company mission and products..."
                  className="w-full px-3.5 py-2 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
                >
                  {editingCompany ? 'Save Changes' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT ROLE FORM (WITH CKEDITOR + ATTACHMENTS + DATES + TOGGLE) */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] glass-modal rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative my-auto overflow-y-auto space-y-6">
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">
              {editingRole ? 'Edit Career Role Posting' : 'Post New Career Role'}
            </h3>

            <form onSubmit={handleRoleSubmit} className="space-y-5">
              {/* Row 1: Company Selection & Role Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Company *</label>
                  <select
                    required
                    value={roleCompanyId}
                    onChange={(e) => setRoleCompanyId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.industry})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 2: Department, Location, Work Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={roleDepartment}
                    onChange={(e) => setRoleDepartment(e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={roleLocation}
                    onChange={(e) => setRoleLocation(e.target.value)}
                    placeholder="e.g. Remote / New York"
                    className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Type</label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value as WorkType)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Start Date, End Date & Active Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={roleStartDate}
                    onChange={(e) => setRoleStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={roleEndDate}
                    onChange={(e) => setRoleEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Active Status Toggle</label>
                  <button
                    type="button"
                    onClick={() => setRoleIsActive(!roleIsActive)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition ${
                      roleIsActive
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {roleIsActive ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-400" />
                        <span>Role is Active (Visible)</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-rose-400" />
                        <span>Role is Inactive (Hidden)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Row 4: External Application Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Application URL Link *</label>
                <input
                  type="url"
                  required
                  value={roleApplyUrl}
                  onChange={(e) => setRoleApplyUrl(e.target.value)}
                  placeholder="https://careers.company.com/apply/job-id"
                  className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Row 5: CKEditor Description & Attachments */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Description (CKEditor Formatting) & Attachments</label>
                <CKEditorWrapper
                  value={roleDescriptionHtml}
                  onChange={setRoleDescriptionHtml}
                  attachments={roleAttachments}
                  onAddAttachment={(att) => setRoleAttachments([...roleAttachments, att])}
                  onRemoveAttachment={(id) => setRoleAttachments(roleAttachments.filter((a) => a.id !== id))}
                />
              </div>

              {/* Submit Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
                >
                  {editingRole ? 'Update Role Posting' : 'Publish Role Posting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.type === 'company' ? 'Delete Hiring Company' : 'Delete Career Role'}
        itemName={deleteModalState.name}
        message={deleteModalState.message}
        onClose={() => setDeleteModalState({ ...deleteModalState, isOpen: false })}
        onConfirm={() => {
          if (deleteModalState.type === 'company') {
            onDeleteCompany(deleteModalState.id);
          } else {
            onDeleteRole(deleteModalState.id);
          }
        }}
      />
    </div>
  );
};
