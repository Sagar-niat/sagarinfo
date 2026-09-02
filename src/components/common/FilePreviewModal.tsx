import React from 'react';
import { X, Download, ExternalLink, ShieldCheck, Printer, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const FilePreviewModal: React.FC = () => {
  const { previewFile, closePreviewFile, showToast } = useData();

  if (!previewFile) return null;

  const isDataUrl = previewFile.url.startsWith('data:');
  const isImage =
    isDataUrl
      ? previewFile.url.startsWith('data:image/')
      : Boolean(previewFile.url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i)) ||
        ['png', 'jpg', 'jpeg', 'image'].includes(previewFile.type);

  const isPdf =
    isDataUrl
      ? previewFile.url.startsWith('data:application/pdf')
      : previewFile.url.endsWith('.pdf') || previewFile.type === 'pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = previewFile.url;
    link.download = previewFile.title;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(`Downloading "${previewFile.title}"...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden animate-modal-pop">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{previewFile.title}</h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Encrypted Real Vault Asset
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Print file"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all touch-target"
            >
              <Download className="w-3.5 h-3.5" /> Download Real File
            </button>
            <button
              onClick={closePreviewFile}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File Content Body */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 overflow-auto flex items-center justify-center relative">
          {isImage ? (
            <img
              src={previewFile.url}
              alt={previewFile.title}
              className="max-h-full max-w-full object-contain rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xl"
            />
          ) : isPdf ? (
            <object
              data={previewFile.url}
              type="application/pdf"
              className="w-full h-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white"
            >
              <iframe
                src={previewFile.url}
                title={previewFile.title}
                className="w-full h-full rounded-2xl bg-white"
              />
            </object>
          ) : (
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 mx-auto flex items-center justify-center mb-4 text-cyan-500">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{previewFile.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                This document is safely stored in your vault. Click below to download the original binary file.
              </p>
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg touch-target"
              >
                Download Real Binary File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
