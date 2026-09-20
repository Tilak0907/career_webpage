'use client';

import React, { useState, useEffect } from 'react';
import { Attachment } from '@/types';
import { X, Download, FileText, Image as ImageIcon, ExternalLink, AlertCircle } from 'lucide-react';

interface AttachmentViewerModalProps {
  attachment: Attachment | null;
  isOpen: boolean;
  onClose: () => void;
}

// Convert Base64/DataURL to Blob for safe browser viewing & downloading without Data URL blocking
function dataURLtoBlob(dataurl: string): Blob | null {
  try {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch {
    return null;
  }
}

export const AttachmentViewerModal: React.FC<AttachmentViewerModalProps> = ({
  attachment,
  isOpen,
  onClose,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!attachment || !attachment.url) {
      setBlobUrl(null);
      return;
    }

    if (attachment.url.startsWith('data:')) {
      const blob = dataURLtoBlob(attachment.url);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      }
    } else {
      setBlobUrl(attachment.url);
    }
  }, [attachment]);

  if (!isOpen || !attachment) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = blobUrl || attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl h-[85vh] glass-modal rounded-3xl border border-white/10 shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 md:px-6 bg-slate-900 border-b border-white/10">
          <div className="flex items-center gap-3 truncate pr-4">
            <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
              {attachment.type === 'pdf' ? (
                <FileText className="w-5 h-5 text-rose-400" />
              ) : (
                <ImageIcon className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-white truncate">{attachment.name}</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{attachment.type} Document</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Content Area */}
        <div className="flex-1 bg-slate-950 p-4 overflow-auto flex items-center justify-center">
          {attachment.type === 'pdf' ? (
            blobUrl ? (
              <iframe
                src={blobUrl}
                title={attachment.name}
                className="w-full h-full rounded-2xl border border-white/10 bg-white"
              />
            ) : (
              <div className="text-center space-y-3 p-6 text-slate-400">
                <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
                <p className="text-xs">Unable to load PDF preview in iframe.</p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Download PDF Instead
                </button>
              </div>
            )
          ) : (
            <div className="max-w-full max-h-full flex items-center justify-center p-2">
              <img
                src={blobUrl || attachment.url}
                alt={attachment.name}
                className="max-w-full max-h-[70vh] rounded-2xl object-contain shadow-2xl border border-white/10"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
