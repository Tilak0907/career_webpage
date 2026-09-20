'use client';

import React, { useState } from 'react';
import { Role, Company, Attachment } from '@/types';
import { X, Building2, MapPin, Calendar, Clock, ExternalLink, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, MousePointerClick, Eye } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="w-full max-w-3xl max-h-[92vh] light-modal rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Top Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-200">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              {company?.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 shadow-xs bg-slate-50 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {company?.name || 'Company'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-medium text-slate-500">{role.department}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 leading-snug">
                  {role.title}
                </h2>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {role.location}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold text-[11px]">
                    {role.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto py-4 sm:py-6 space-y-4 sm:space-y-6 pr-1">
            {/* Status & Date Range Bar */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="text-slate-700">
                  <span className="text-slate-500">Application Period: </span>
                  <span className="font-bold text-slate-900">{role.startDate}</span>
                  <span className="text-slate-400 mx-1">to</span>
                  <span className="font-bold text-slate-900">{role.endDate}</span>
                </div>
              </div>

              {/* Validity Badges */}
              {isExpired ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full badge-light-rose font-semibold shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Applications Closed</span>
                </div>
              ) : isPending ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full badge-light-amber font-semibold shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Opening Soon ({role.startDate})</span>
                </div>
              ) : role.isActive ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full badge-light-emerald font-semibold shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Actively Accepting Applications</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full badge-light-rose font-semibold shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Inactive Status</span>
                </div>
              )}
            </div>

            {/* Description Content (Formatted CKEditor HTML) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description & Requirements</h3>
              <div
                className="rich-content-light p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm"
                dangerouslySetInnerHTML={{ __html: role.descriptionHtml || '<p className="text-slate-500 italic">No detailed description available.</p>' }}
              />
            </div>

            {/* Attachments Section */}
            {role.attachments && role.attachments.length > 0 && (
              <div className="space-y-2 pt-1">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Attachments & Documents ({role.attachments.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {role.attachments.map((att) => (
                    <div
                      key={att.id}
                      onClick={() => setViewingAttachment(att)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-indigo-600 transition">
                          {att.type === 'pdf' ? (
                            <FileText className="w-4 h-4 text-rose-600" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-cyan-600" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">{att.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{att.type} document</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-indigo-600 font-semibold group-hover:underline shrink-0">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="pt-3 sm:pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <MousePointerClick className="w-4 h-4 text-indigo-600" />
              <span><strong className="text-slate-900">{role.applyCount}</strong> candidates clicked apply link</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleApplyNow}
                disabled={isExpired || !role.isActive}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition cursor-pointer ${
                  isExpired || !role.isActive
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
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
