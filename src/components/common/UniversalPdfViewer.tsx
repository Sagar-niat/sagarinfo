import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle, ZoomIn, ZoomOut, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface UniversalPdfViewerProps {
  url: string;
  title: string;
}

export const UniversalPdfViewer: React.FC<UniversalPdfViewerProps> = ({ url, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const initPdf = async () => {
      try {
        // Dynamically load PDF.js engine from CDN if window.pdfjsLib is not present
        let pdfjs = (window as any).pdfjsLib;
        if (!pdfjs) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load PDF engine'));
            document.head.appendChild(script);
          });
          pdfjs = (window as any).pdfjsLib;
        }

        if (pdfjs) {
          pdfjs.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        if (!pdfjs) throw new Error('PDF engine initialized incorrectly');

        let loadingTask: any;
        if (url.startsWith('data:')) {
          // Convert Base64 Data URL to Uint8Array
          const base64Str = url.split(',')[1];
          const binaryStr = atob(base64Str);
          const len = binaryStr.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          loadingTask = pdfjs.getDocument({ data: bytes });
        } else {
          loadingTask = pdfjs.getDocument(url);
        }

        const pdf = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err: any) {
        console.warn('PDF.js render notice:', err);
        if (isMounted) {
          setError(err?.message || 'Could not load PDF bytes');
          setLoading(false);
        }
      }
    };

    if (url) {
      initPdf();
    } else {
      setError('No document URL provided');
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [url]);

  // Render pages when pdf or scale changes
  useEffect(() => {
    if (!pdfDocRef.current || !containerRef.current) return;

    const renderAllPages = async () => {
      const container = containerRef.current;
      if (!container) return;
      container.innerHTML = '';

      for (let i = 1; i <= pdfDocRef.current.numPages; i++) {
        try {
          const page = await pdfDocRef.current.getPage(i);
          const viewport = page.getViewport({ scale });

          const pageWrapper = document.createElement('div');
          pageWrapper.className =
            'mb-4 relative bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all';

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.className = 'max-w-full h-auto block mx-auto';

          pageWrapper.appendChild(canvas);
          container.appendChild(pageWrapper);

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
        } catch (e) {
          console.warn(`Error rendering page ${i}:`, e);
        }
      }
    };

    renderAllPages();
  }, [numPages, scale]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.6));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-3" />
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Decrypting and rendering PDF pages for mobile view...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        {/* Fallback iframe / object if PDF.js fails */}
        <iframe
          src={url}
          title={title}
          className="w-full h-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white shadow-xl"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center relative overflow-hidden bg-slate-200/60 dark:bg-slate-950">
      {/* Floating Toolbar Controls */}
      <div className="sticky top-2 z-10 my-2 px-4 py-2 bg-slate-900/90 text-white backdrop-blur-md border border-slate-700 rounded-full shadow-2xl flex items-center gap-3 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <FileText className="w-4 h-4" />
          <span>{numPages} {numPages === 1 ? 'Page' : 'Pages'}</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono px-1">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rendered PDF Pages Container */}
      <div
        ref={containerRef}
        className="w-full flex-1 overflow-auto p-2 sm:p-4 flex flex-col items-center justify-start max-w-full"
      />
    </div>
  );
};
