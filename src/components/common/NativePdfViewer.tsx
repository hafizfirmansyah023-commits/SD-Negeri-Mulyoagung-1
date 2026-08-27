import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, FileWarning, RotateCw } from 'lucide-react';

// Setup worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface NativePdfViewerProps {
  pdfUrl: string;
  title: string;
}

export const NativePdfViewer: React.FC<NativePdfViewerProps> = ({ pdfUrl, title }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [renderLoading, setRenderLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const renderTaskRef = useRef<any>(null);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError('');
    setPageNum(1);
    setPdfDoc(null);

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: false,
        });
        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Error loading PDF:', err);
          setError('Gagal memuat dokumen PDF. Silakan gunakan tombol Buka Dokumen di atas untuk melihat dokumen secara langsung.');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  // Render Page to Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;

    const renderPage = async () => {
      setRenderLoading(true);
      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled || !canvasRef.current) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Support high DPI
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.height = viewport.height * pixelRatio;
        canvas.width = viewport.width * pixelRatio;
        canvas.style.height = `${viewport.height}px`;
        canvas.style.width = `${viewport.width}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        if (!isCancelled) {
          setRenderLoading(false);
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException' && !isCancelled) {
          console.error('Page render error:', err);
          setRenderLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, scale]);

  const handlePrevPage = () => {
    if (pageNum > 1) setPageNum((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (pageNum < numPages) setPageNum((prev) => prev + 1);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handleResetZoom = () => {
    setScale(1.2);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-300 space-y-3 bg-slate-900 min-h-[400px]">
        <Loader2 size={36} className="animate-spin text-teal-400" />
        <p className="text-sm font-medium">Memuat dokumen PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-300 space-y-3 bg-slate-900 min-h-[400px]">
        <FileWarning size={48} className="text-amber-400" />
        <p className="text-sm font-semibold text-slate-200 max-w-md">{error}</p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md transition-all"
        >
          Buka Dokumen PDF di Tab Baru
        </a>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden select-none">
      {/* Viewer Toolbar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-3 text-xs text-slate-300 shrink-0 z-10">
        
        {/* Pagination Navigation */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={handlePrevPage}
            disabled={pageNum <= 1}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1 px-1 sm:px-2 font-mono font-medium text-[11px] sm:text-xs">
            <span className="text-teal-400 font-bold">{pageNum}</span>
            <span className="text-slate-500">/</span>
            <span>{numPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={pageNum >= numPages}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Halaman Berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Perkecil Tampilan"
          >
            <ZoomOut size={14} />
          </button>

          <span className="px-1 text-[10px] sm:text-[11px] font-mono text-slate-400 min-w-[36px] sm:min-w-[45px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 2.5}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Perbesar Tampilan"
          >
            <ZoomIn size={14} />
          </button>

          <button
            onClick={handleResetZoom}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors ml-0.5 sm:ml-1"
            title="Atur Ulang Zoom"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto p-2 sm:p-6 md:p-8 flex items-center justify-center relative bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-700">
        {renderLoading && (
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="bg-slate-900/90 text-teal-300 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-semibold">
              <Loader2 size={16} className="animate-spin text-teal-400" />
              <span>Memuat halaman {pageNum}...</span>
            </div>
          </div>
        )}
        <div className="m-auto flex items-center justify-center py-1 sm:py-2">
          <div className="shadow-2xl ring-1 ring-slate-700/50 rounded-lg overflow-hidden bg-white max-w-full transition-all duration-200">
            <canvas ref={canvasRef} className="block mx-auto max-w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
