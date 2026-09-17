import React, { useState } from 'react';
import { X, Download, ExternalLink, ShieldCheck, Printer, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const FilePreviewModal: React.FC = () => {
  const { previewFile, closePreviewFile, showToast } = useData();
  const [iframeError, setIframeError] = useState(false);

  if (!previewFile) return null;

  const rawUrl = previewFile.url || '';
  const isDataUrl = rawUrl.startsWith('data:');
  const isBlobUrl = rawUrl.startsWith('blob:');
  const isImage =
    isDataUrl
      ? rawUrl.startsWith('data:image/')
      : Boolean(rawUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i)) ||
        ['png', 'jpg', 'jpeg', 'image'].includes(previewFile.type);

  const hasValidUrl = Boolean(rawUrl && rawUrl !== '#' && !rawUrl.includes('w3.org'));

  const handleDownload = () => {
    if (!hasValidUrl) {
      showToast('No active download link available.', 'info');
      return;
    }
    const link = document.createElement('a');
    link.href = rawUrl;
    link.download = previewFile.title || 'document';
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(`Downloading "${previewFile.title}"...`);
  };

  const handlePrint = () => {
    if (hasValidUrl) {
      window.print();
    } else {
      showToast('Printing unavailable.', 'info');
    }
  };

  const handleClose = () => {
    setIframeError(false);
    closePreviewFile();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[88vh] overflow-hidden animate-modal-pop">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{previewFile.title}</h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Encrypted Vault Asset
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
            {hasValidUrl && (
              <button
                onClick={handleDownload}
                className="px-4 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all touch-target"
              >
                <Download className="w-3.5 h-3.5" /> Download File
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real Document Viewer Area */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 overflow-auto flex items-center justify-center relative">
          {hasValidUrl && !iframeError ? (
            isImage ? (
              <img
                src={rawUrl}
                alt={previewFile.title}
                className="max-h-full max-w-full object-contain rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xl"
              />
            ) : (
              <object
                data={rawUrl}
                type="application/pdf"
                className="w-full h-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white shadow-xl overflow-hidden"
              >
                <embed
                  src={rawUrl}
                  type="application/pdf"
                  className="w-full h-full rounded-2xl bg-white"
                />
              </object>
            )
          ) : (
            <div className="text-center p-8 max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mx-auto flex items-center justify-center mb-5 text-indigo-500">
                <FileText className="w-10 h-10" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{previewFile.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Document record verified in Cloud Vault. To view this document, please upload the PDF file again using the "Upload to Vault" button.
              </p>
              {hasValidUrl && (
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg touch-target flex items-center gap-2 mx-auto"
                >
                  <Download className="w-4 h-4" /> Download Original File
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
