'use client';

import React, { useState } from 'react';
import { Role, Company, Attachment } from '@/types';
import { X, Building2, MapPin, Calendar, Clock, ExternalLink, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, MousePointerClick, Eye, Download } from 'lucide-react';
import { incrementRoleApplyCount } from '@/lib/store';
import { AttachmentViewerModal } from './AttachmentViewerModal';

interface RoleDetailModalProps {
  role: Role | null;
  company: Company | undefined;
  isOpen: boolean;
  onClose: () => void;
  onApplyClicked?: (roleId: string) => void;
}

export const RoleDetailModal: React.FC<RoleDetailModalProps> = ({
  role,
  company,
  isOpen,
  onClose,
  onApplyClicked,
}) => {
  const [viewingAttachment, setViewingAttachment] = useState<Attachment | null>(null);

  if (!isOpen || !role) return null;

  // Handle Apply button click
  const handleApplyNow = () => {
    incrementRoleApplyCount(role.id);
    if (onApplyClicked) onApplyClicked(role.id);
    if (role.applyUrl) {
      window.open(role.applyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Date checks for role validity
  const today = new Date().toISOString().split('T')[0];
  const isExpired = role.endDate && role.endDate < today;
  const isPending = role.startDate && role.startDate > today;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
        <div
          className="w-full max-w-3xl max-h-[90vh] glass-modal rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Top Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              {company?.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-md bg-slate-900"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Building2 className="w-8 h-8" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    {company?.name || 'Company'}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">{role.department}</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">{role.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {role.location}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                    {role.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
            {/* Status & Date Range Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-slate-400">Application Period: </span>
                  <span className="font-semibold text-slate-200">{role.startDate}</span>
                  <span className="text-slate-500 mx-1.5">to</span>
                  <span className="font-semibold text-slate-200">{role.endDate}</span>
                </div>
              </div>

              {/* Validity Badge */}
              {isExpired ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full badge-rose font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Applications Closed</span>
                </div>
              ) : isPending ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full badge-amber font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Opening Soon ({role.startDate})</span>
                </div>
              ) : role.isActive ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full badge-emerald font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Actively Accepting Applications</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full badge-rose font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Inactive Status</span>
                </div>
              )}
            </div>

            {/* Description Content (CKEditor HTML) */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Description & Requirements</h3>
              <div
                className="rich-content p-5 rounded-2xl bg-slate-900/50 border border-white/5 text-sm"
                dangerouslySetInnerHTML={{ __html: role.descriptionHtml || '<p className="text-slate-500 italic">No detailed description available.</p>' }}
              />
            </div>

            {/* Attachments Section */}
            {role.attachments && role.attachments.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attachments & Documents ({role.attachments.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {role.attachments.map((att) => (
                    <div
                      key={att.id}
                      onClick={() => setViewingAttachment(att)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/90 transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-indigo-600/20 text-indigo-400 transition">
                          {att.type === 'pdf' ? (
                            <FileText className="w-5 h-5 text-rose-400" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-cyan-400" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300">{att.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{att.type} document</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium group-hover:underline shrink-0">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MousePointerClick className="w-4 h-4 text-indigo-400" />
              <span><strong className="text-slate-200">{role.applyCount}</strong> applicants clicked apply link</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/10 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleApplyNow}
                disabled={isExpired || !role.isActive}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white shadow-lg transition cursor-pointer ${
                  isExpired || !role.isActive
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                }`}
              >
                <span>Apply Now</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Document Preview Modal */}
      <AttachmentViewerModal
        attachment={viewingAttachment}
        isOpen={Boolean(viewingAttachment)}
        onClose={() => setViewingAttachment(null)}
      />
    </>
  );
};
