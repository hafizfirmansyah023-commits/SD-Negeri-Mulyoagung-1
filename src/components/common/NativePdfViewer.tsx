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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [initialFitDone, setInitialFitDone] = useState<boolean>(false);
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
    setInitialFitDone(false);

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

  // Calculate responsive fit scale on initial load or mobile
  useEffect(() => {
    if (!pdfDoc || initialFitDone) return;

    let isMounted = true;
    const calculateInitialFit = async () => {
      try {
        const firstPage = await pdfDoc.getPage(1);
        const unscaledViewport = firstPage.getViewport({ scale: 1.0 });
        const containerWidth = containerRef.current?.clientWidth || window.innerWidth;

        let computedScale = 1.15;
        if (containerWidth < 640) {
          // Mobile (320px - 639px): Fit width with margin
          computedScale = Math.max(0.45, Math.min((containerWidth - 28) / unscaledViewport.width, 1.2));
        } else if (containerWidth < 1024) {
          // Tablet
          computedScale = Math.max(0.6, Math.min((containerWidth - 48) / unscaledViewport.width, 1.25));
        } else {
          // Desktop
          computedScale = 1.15;
        }

        if (isMounted) {
          setScale(Number(computedScale.toFixed(2)));
          setInitialFitDone(true);
        }
      } catch {
        if (isMounted) {
          setInitialFitDone(true);
        }
      }
    };

    calculateInitialFit();

    return () => {
      isMounted = false;
    };
  }, [pdfDoc, initialFitDone]);

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
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.width = Math.floor(viewport.width * pixelRatio);

        // CSS Display dimensions: STRICTLY preserve aspect ratio
        canvas.style.width = `${viewport.width}px`;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        canvas.style.aspectRatio = `${viewport.width} / ${viewport.height}`;

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
    setScale((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.45));
  };

  const handleResetZoom = async () => {
    if (pdfDoc) {
      try {
        const firstPage = await pdfDoc.getPage(1);
        const unscaledViewport = firstPage.getViewport({ scale: 1.0 });
        const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
        if (containerWidth < 640) {
          const fitScale = Math.max(0.45, Math.min((containerWidth - 28) / unscaledViewport.width, 1.2));
          setScale(Number(fitScale.toFixed(2)));
          return;
        }
      } catch {}
    }
    setScale(1.0);
  };

  // Swipe Gesture Handling for PDF Page Navigation
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwiping.current || touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Trigger page flip only if horizontal swipe is intentional (more horizontal than vertical and > 40px)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        // Swiped Left -> Next page
        if (pageNum < numPages) {
          handleNextPage();
        }
      } else {
        // Swiped Right -> Previous page
        if (pageNum > 1) {
          handlePrevPage();
        }
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
  };

  // Keyboard Arrow Left/Right to flip pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (pageNum < numPages) {
          setPageNum((prev) => Math.min(prev + 1, numPages));
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (pageNum > 1) {
          setPageNum((prev) => Math.max(prev - 1, 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNum, numPages]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-300 space-y-3 bg-slate-900 min-h-[300px]">
        <Loader2 size={36} className="animate-spin text-teal-400" />
        <p className="text-sm font-medium">Memuat dokumen PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center text-slate-300 space-y-3 bg-slate-900 min-h-[300px]">
        <FileWarning size={42} className="text-amber-400" />
        <p className="text-sm font-semibold text-slate-200 max-w-md">{error}</p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          Buka Dokumen PDF di Tab Baru
        </a>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Viewer Toolbar */}
      <div className="bg-slate-950/95 border-b border-slate-800 px-2.5 sm:px-4 py-2 flex items-center justify-between gap-1.5 sm:gap-3 text-xs text-slate-300 shrink-0 z-10">
        
        {/* Pagination Navigation */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={handlePrevPage}
            disabled={pageNum <= 1}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Halaman Sebelumnya (Geser Kanan / Panah Kiri)"
            aria-label="Halaman Sebelumnya"
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
            title="Halaman Berikutnya (Geser Kiri / Panah Kanan)"
            aria-label="Halaman Berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Swipe Hint on Mobile */}
        <span className="hidden md:inline text-[10px] text-slate-500">
          Geser kiri / kanan atau gunakan tombol panah untuk ganti halaman
        </span>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.45}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Perkecil Tampilan"
            aria-label="Perkecil Tampilan"
          >
            <ZoomOut size={14} />
          </button>

          <span className="px-0.5 sm:px-1 text-[10px] sm:text-[11px] font-mono text-slate-400 min-w-[32px] sm:min-w-[45px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 2.5}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Perbesar Tampilan"
            aria-label="Perbesar Tampilan"
          >
            <ZoomIn size={14} />
          </button>

          <button
            onClick={handleResetZoom}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors ml-0.5 sm:ml-1"
            title="Sesuaikan dengan Layar (Fit Width)"
            aria-label="Sesuaikan dengan Layar"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-2 sm:p-6 md:p-8 flex items-center justify-center relative bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-700"
      >
        {renderLoading && (
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="bg-slate-900/90 text-teal-300 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-semibold">
              <Loader2 size={16} className="animate-spin text-teal-400" />
              <span>Memuat halaman {pageNum}...</span>
            </div>
          </div>
        )}
        <div className="m-auto flex items-center justify-center py-1 sm:py-2 max-w-full">
          <div className="shadow-2xl ring-1 ring-slate-700/50 rounded-lg overflow-hidden bg-white max-w-full flex items-center justify-center transition-all duration-200">
            <canvas ref={canvasRef} className="block mx-auto max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
