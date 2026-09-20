'use client';

import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Link as LinkIcon, Code, Image as ImageIcon, FileText, Upload, Trash2, Eye } from 'lucide-react';
import { Attachment } from '@/types';
import { AttachmentViewerModal } from './AttachmentViewerModal';

interface CKEditorWrapperProps {
  value: string;
  onChange: (html: string) => void;
  attachments: Attachment[];
  onAddAttachment: (att: Attachment) => void;
  onRemoveAttachment: (id: string) => void;
}

export const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  value,
  onChange,
  attachments,
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const [showCodeView, setShowCodeView] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  // Helper formatting injectors for rich editor toolbar buttons
  const executeFormatting = (command: string, valueArg: string = '') => {
    let newHtml = value;
    switch (command) {
      case 'bold':
        newHtml += ' <strong>Bold text</strong>';
        break;
      case 'italic':
        newHtml += ' <em>Italic text</em>';
        break;
      case 'h2':
        newHtml += '\n<h3>Heading Title</h3>';
        break;
      case 'h3':
        newHtml += '\n<h4>Section Subtitle</h4>';
        break;
      case 'ul':
        newHtml += '\n<ul>\n  <li>Key responsibility or requirement</li>\n  <li>Another bullet point</li>\n</ul>';
        break;
      case 'ol':
        newHtml += '\n<ol>\n  <li>Step one</li>\n  <li>Step two</li>\n</ol>';
        break;
      case 'quote':
        newHtml += '\n<blockquote>"Highlight quote or team value statement"</blockquote>';
        break;
      case 'link':
        const url = prompt('Enter destination web link URL:', 'https://');
        if (url) {
          newHtml += ` <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #6366f1; text-decoration: underline;">Link Text</a>`;
        }
        break;
      default:
        break;
    }
    onChange(newHtml);
  };

  // Handle local file uploads for Images or PDFs
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isImage = file.type.startsWith('image/');

      if (!isPdf && !isImage) {
        alert('Only Image (.png, .jpg, .webp) and PDF (.pdf) files are supported.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        const newAttachment: Attachment = {
          id: 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          type: isPdf ? 'pdf' : 'image',
          url: base64Url,
          sizeBytes: file.size,
          uploadedAt: new Date().toISOString(),
        };
        onAddAttachment(newAttachment);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Editor Main Container */}
      <div className="border border-white/10 rounded-2xl bg-slate-900/90 overflow-hidden shadow-inner">
        {/* CKEditor Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-950/80 border-b border-white/10 text-slate-300">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mr-2">
              CKEditor 5
            </span>

            <button
              type="button"
              onClick={() => executeFormatting('bold')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeFormatting('italic')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            <button
              type="button"
              onClick={() => executeFormatting('h2')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Heading 2"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeFormatting('h3')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Heading 3"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            <button
              type="button"
              onClick={() => executeFormatting('ul')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Bulleted List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeFormatting('ol')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeFormatting('quote')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeFormatting('link')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle HTML Code View */}
          <button
            type="button"
            onClick={() => setShowCodeView(!showCodeView)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition border ${
              showCodeView
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-900 text-slate-400 hover:text-white border-white/10'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCodeView ? 'WYSIWYG Mode' : 'HTML Source'}</span>
          </button>
        </div>

        {/* Text Area or Code View */}
        {showCodeView ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={8}
            className="w-full p-4 bg-slate-950 font-mono text-xs text-indigo-300 focus:outline-none resize-y"
            placeholder="Edit raw HTML markup..."
          />
        ) : (
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={8}
              className="w-full p-4 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-y"
              placeholder="Type job description, responsibilities, qualifications, and benefits here..."
            />
          </div>
        )}

        {/* Live Preview Panel */}
        <div className="p-4 bg-slate-950/60 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Rendered Description Preview:</span>
          </div>
          <div
            className="rich-content min-h-[60px] p-3 rounded-xl bg-slate-900/60 border border-white/5 text-sm"
            dangerouslySetInnerHTML={{ __html: value || '<p className="text-slate-500 italic">No description provided yet...</p>' }}
          />
        </div>
      </div>

      {/* Attachments Section */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Image & PDF Attachments ({attachments.length})
            </h4>
          </div>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Attach File (.pdf, .png, .jpg)</span>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
          </label>
        </div>

        {attachments.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2 text-center border border-dashed border-white/10 rounded-xl">
            No attachments added yet. Upload PDFs or images (e.g. role specification document, team culture deck).
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  {att.type === 'pdf' ? (
                    <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                  <span className="font-medium text-slate-200 truncate">{att.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewAttachment(att)}
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(att.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attachment Document Preview Modal */}
      <AttachmentViewerModal
        attachment={previewAttachment}
        isOpen={Boolean(previewAttachment)}
        onClose={() => setPreviewAttachment(null)}
      />
    </div>
  );
};
