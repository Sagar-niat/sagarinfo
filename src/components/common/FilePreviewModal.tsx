import React from 'react';
import { X, Download, ExternalLink, ShieldCheck, Printer, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { UniversalPdfViewer } from './UniversalPdfViewer';

export const FilePreviewModal: React.FC = () => {
  const { previewFile, closePreviewFile, showToast } = useData();

  if (!previewFile) return null;

  const rawUrl = previewFile.url || '';
  const isDataUrl = rawUrl.startsWith('data:');
  const isImage =
    isDataUrl
      ? rawUrl.startsWith('data:image/')
      : Boolean(rawUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i)) ||
        ['png', 'jpg', 'jpeg', 'image'].includes(previewFile.type);

  const hasValidUrl = Boolean(rawUrl && rawUrl !== '#' && !rawUrl.includes('w3.org'));

  const handleDownload = async () => {
    if (!hasValidUrl) {
      showToast('No active document file available.', 'info');
      return;
    }

    try {
      if (rawUrl.startsWith('data:')) {
        const arr = rawUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = previewFile.title || 'document';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else {
        const response = await fetch(rawUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = previewFile.title || 'document';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      }
      showToast(`Downloading "${previewFile.title}"...`);
    } catch (err) {
      const link = document.createElement('a');
      link.href = rawUrl;
      link.target = '_blank';
      link.download = previewFile.title || 'document';
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handleOpenNewTab = () => {
    if (!hasValidUrl) return;
    const win = window.open(rawUrl, '_blank');
    if (!win) {
      showToast('Please allow popups to open document in new tab', 'info');
    }
  };

  const handlePrint = () => {
    if (hasValidUrl) {
      window.print();
    } else {
      showToast('Printing unavailable.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[90vh] sm:h-[88vh] overflow-hidden animate-modal-pop">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{previewFile.title}</h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Encrypted Vault Asset
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {hasValidUrl && (
              <button
                onClick={handleOpenNewTab}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handlePrint}
              className="hidden sm:block p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Print file"
            >
              <Printer className="w-4 h-4" />
            </button>
            {hasValidUrl && (
              <button
                onClick={handleDownload}
                className="px-3 sm:px-4 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all touch-target"
              >
                <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Download</span> File
              </button>
            )}
            <button
              onClick={closePreviewFile}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real Document Viewer Area */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 overflow-hidden flex items-center justify-center relative">
          {hasValidUrl ? (
            isImage ? (
              <img
                src={rawUrl}
                alt={previewFile.title}
                className="max-h-full max-w-full object-contain rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xl"
              />
            ) : (
              <UniversalPdfViewer url={rawUrl} title={previewFile.title} />
            )
          ) : (
            <div className="text-center p-6 sm:p-8 max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mx-auto flex items-center justify-center mb-4 text-indigo-500">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">{previewFile.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Document record verified in Personal Vault.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
