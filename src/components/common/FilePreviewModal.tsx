import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, ShieldCheck, Printer, FileText, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { UniversalPdfViewer } from './UniversalPdfViewer';

export const FilePreviewModal: React.FC = () => {
  const { previewFile, closePreviewFile, showToast } = useData();
  const [textContent, setTextContent] = useState<string | null>(null);

  useEffect(() => {
    if (!previewFile?.url) {
      setTextContent(null);
      return;
    }

    const url = previewFile.url;
    // Decode text/csv/json Data URLs for instant text document viewing
    if (url.startsWith('data:text/') || url.startsWith('data:application/json')) {
      try {
        const base64Str = url.split(',')[1];
        if (base64Str) {
          const decoded = decodeURIComponent(escape(atob(base64Str)));
          setTextContent(decoded);
        }
      } catch (e) {
        setTextContent(null);
      }
    } else {
      setTextContent(null);
    }
  }, [previewFile]);

  if (!previewFile) return null;

  const rawUrl = previewFile.url || '';
  const title = previewFile.title || 'Document';
  const fileExt = (title.split('.').pop() || previewFile.type || 'file').toLowerCase();
  const isDataUrl = rawUrl.startsWith('data:');
  const hasValidUrl = Boolean(rawUrl && rawUrl !== '#' && !rawUrl.includes('w3.org') && !rawUrl.startsWith('idb:'));

  // Multi-Format Detection
  const isImage =
    isDataUrl
      ? rawUrl.startsWith('data:image/')
      : Boolean(rawUrl.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp)/i)) ||
        ['png', 'jpg', 'jpeg', 'image', 'webp', 'svg'].includes(previewFile.type);

  const isPdf =
    isDataUrl
      ? rawUrl.startsWith('data:application/pdf') || title.toLowerCase().endsWith('.pdf')
      : rawUrl.endsWith('.pdf') || previewFile.type === 'pdf' || title.toLowerCase().endsWith('.pdf');

  const isOfficeDoc = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(fileExt);
  const isTextFile = Boolean(textContent !== null || ['txt', 'csv', 'json', 'md', 'log'].includes(fileExt));

  const handleDownload = async () => {
    if (!hasValidUrl) {
      showToast('No active document file available for download.', 'info');
      return;
    }

    const targetName = title || 'document';
    const cleanDownloadName = targetName.startsWith('idb:') ? 'document' : targetName;
    const downloadFileName = cleanDownloadName.includes('.') ? cleanDownloadName : `${cleanDownloadName}.${fileExt || 'pdf'}`;

    try {
      if (rawUrl.startsWith('data:')) {
        const arr = rawUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
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
        link.download = downloadFileName;
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
        link.download = downloadFileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      }
      showToast(`Downloading "${downloadFileName}"...`);
    } catch (err) {
      const link = document.createElement('a');
      link.href = rawUrl;
      link.target = '_blank';
      link.download = downloadFileName;
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

  // Online Docs Viewer for HTTPS Office files (DOCX, PPTX, XLSX)
  const googleDocsViewerUrl =
    rawUrl.startsWith('http') && isOfficeDoc
      ? `https://docs.google.com/gview?url=${encodeURIComponent(rawUrl)}&embedded=true`
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[90vh] sm:h-[88vh] overflow-hidden animate-modal-pop">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 shrink-0">
              {isOfficeDoc ? (
                <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : isImage ? (
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{title}</h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Encrypted Vault Asset • <span className="uppercase font-bold">{fileExt}</span>
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
              /* 1. Image Files (JPG, PNG, WEBP, SVG) */
              <div className="w-full h-full flex items-center justify-center p-2">
                <img
                  src={rawUrl}
                  alt={title}
                  className="max-h-full max-w-full object-contain rounded-2xl border border-slate-300 dark:border-slate-800 shadow-2xl"
                />
              </div>
            ) : isPdf ? (
              /* 2. PDF Documents */
              <UniversalPdfViewer url={rawUrl} title={title} />
            ) : googleDocsViewerUrl ? (
              /* 3. Office Documents (DOCX, PPTX, XLSX) via Google Docs Embed */
              <iframe
                src={googleDocsViewerUrl}
                title={title}
                className="w-full h-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white shadow-xl"
              />
            ) : isTextFile && textContent ? (
              /* 4. Text & Code Documents (TXT, CSV, JSON, MD) */
              <div className="w-full h-full bg-slate-900 text-slate-100 p-6 rounded-2xl overflow-auto font-mono text-xs border border-slate-800 shadow-xl leading-relaxed">
                <pre className="whitespace-pre-wrap break-words">{textContent}</pre>
              </div>
            ) : (
              /* 5. General Office / Vault Document Card Viewer */
              <div className="text-center p-6 sm:p-10 max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl">
                <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center mb-5 text-cyan-500">
                  {fileExt === 'xlsx' || fileExt === 'xls' || fileExt === 'csv' ? (
                    <FileSpreadsheet className="w-10 h-10" />
                  ) : (
                    <FileText className="w-10 h-10" />
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{title}</h4>
                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase mb-5">
                  {fileExt} Document
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  This document format is encrypted and secured in your Personal Vault. Tap below to open or download the file directly on your mobile device.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg touch-target flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Open & Download {fileExt.toUpperCase()}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="text-center p-6 sm:p-8 max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mx-auto flex items-center justify-center mb-4 text-indigo-500">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
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
