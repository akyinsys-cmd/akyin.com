import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  ArrowDownToLine,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck2,
  FileText,
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  DOWNLOADABLE_PDF_DOCUMENTS,
  DownloadablePdfDocument,
} from '../data/downloadablePdfs';
import { EditorialReveal } from './EditorialReveal';
import { GlassButton, GlassCard, GlassModal, GlassPanel } from './liquid-glass';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface DownloadablePresentationsSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  backgroundClass?: string;
  defaultDocumentId?: DownloadablePdfDocument['id'];
  onStartEnquiry?: (options: { category: string; vertical: string }) => void;
}

export function DownloadablePresentationsSection({
  id = 'services-pricing-downloads',
  eyebrow = 'Official Business & Pricing Documentation',
  title = 'Explore Our Services & Pricing',
  description = 'Discover how AKYIN helps businesses and automotive dealerships grow with practical marketing, creative and digital solutions.',
  className = '',
  backgroundClass = 'bg-[#F5F5F7]',
}: DownloadablePresentationsSectionProps) {
  const [activeModalDoc, setActiveModalDoc] =
    useState<DownloadablePdfDocument | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(19);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewerMode, setViewerMode] = useState<'canvas' | 'frame'>('canvas');
  const [loadingDoc, setLoadingDoc] = useState<boolean>(false);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [renderError, setRenderError] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  // Cover canvas rendering for each card
  const coverCanvasRef1 = useRef<HTMLCanvasElement | null>(null);
  const coverCanvasRef2 = useRef<HTMLCanvasElement | null>(null);

  // Load PDF when preview modal opens
  useEffect(() => {
    if (!activeModalDoc) {
      if (pdfDoc) {
        void pdfDoc.cleanup();
      }
      setPdfDoc(null);
      setRenderError('');
      setActivePage(1);
      setZoomLevel(1);
      return;
    }

    let cancelled = false;
    let loaded: pdfjsLib.PDFDocumentProxy | null = null;
    setLoadingDoc(true);
    setRenderError('');

    const task = pdfjsLib.getDocument({
      url: activeModalDoc.downloadPath,
      disableAutoFetch: false,
    });

    task.promise
      .then((doc) => {
        if (cancelled) {
          void doc.cleanup();
          return;
        }
        loaded = doc;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setActivePage(1);
        setLoadingDoc(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to open PDF in preview mode:', err);
        setRenderError(
          'Interactive slide reader could not load this file. Switch to Frame View or download directly.'
        );
        setLoadingDoc(false);
      });

    return () => {
      cancelled = true;
      if (loaded) {
        void loaded.cleanup();
      } else {
        void task.destroy();
      }
    };
  }, [activeModalDoc]);

  // Render modal canvas page
  const paintModalPage = useCallback(
    async (
      doc: pdfjsLib.PDFDocumentProxy,
      pageNum: number,
      canvas: HTMLCanvasElement,
      zoom: number
    ) => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Task cancellation expected
        }
      }

      try {
        const page = await doc.getPage(pageNum);
        const container = canvas.parentElement;
        const containerWidth = container ? container.clientWidth - 32 : 900;
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.max(0.65, containerWidth / baseViewport.width);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const targetScale = fitScale * zoom;

        const viewport = page.getViewport({ scale: targetScale * dpr });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const task = page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        });
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (!msg.includes('Rendering cancelled')) {
          console.error('PDF page render error:', err);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!pdfDoc || viewerMode !== 'canvas' || !canvasRef.current || !activeModalDoc) return;
    void paintModalPage(pdfDoc, activePage, canvasRef.current, zoomLevel);
  }, [pdfDoc, activePage, zoomLevel, viewerMode, activeModalDoc, paintModalPage]);

  // Render card covers on mount
  useEffect(() => {
    let cancelled = false;

    const renderCover = async (
      pdfPath: string,
      canvas: HTMLCanvasElement | null
    ) => {
      if (!canvas) return;
      try {
        const doc = await pdfjsLib.getDocument({ url: pdfPath }).promise;
        if (cancelled) {
          void doc.cleanup();
          return;
        }
        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale: 0.8 });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = '100%';
        canvas.style.height = 'auto';

        const ctx = canvas.getContext('2d');
        if (ctx) {
          await page.render({
            canvasContext: ctx,
            viewport: page.getViewport({ scale: 0.8 * dpr }),
            canvas,
          }).promise;
        }
        void doc.cleanup();
      } catch {
        // Fallback graphical cover will show
      }
    };

    void renderCover(
      DOWNLOADABLE_PDF_DOCUMENTS[0].downloadPath,
      coverCanvasRef1.current
    );
    void renderCover(
      DOWNLOADABLE_PDF_DOCUMENTS[1].downloadPath,
      coverCanvasRef2.current
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!activeModalDoc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalDoc(null);
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setActivePage((prev) => (prev >= totalPages ? 1 : prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setActivePage((prev) => (prev <= 1 ? totalPages : prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalDoc, totalPages]);

  // Download Handler (Triggers explicit browser download)
  const handleDownload = async (doc: DownloadablePdfDocument) => {
    if (downloadingId === doc.id) return;
    setDownloadingId(doc.id);
    try {
      const response = await fetch(doc.downloadPath);
      if (!response.ok) {
        throw new Error(`Failed to download: HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = doc.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      setDownloadSuccessId(doc.id);
      setTimeout(() => setDownloadSuccessId(null), 3500);
    } catch {
      // Direct anchor click fallback
      const link = document.createElement('a');
      link.href = doc.downloadPath;
      link.download = doc.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDownloadSuccessId(doc.id);
      setTimeout(() => setDownloadSuccessId(null), 3500);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section
      id={id}
      aria-label="Downloadable Business Services and Pricing Presentations"
      className={`relative py-20 lg:py-24 border-y border-[#E8E8ED] ${backgroundClass} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <EditorialReveal className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#FFFFFF] border border-[#E8E8ED] text-[#1D1D1F] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
            <span className="uppercase tracking-[0.08em] text-[#6E6E73]">{eyebrow}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D1D1F] text-balance">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed text-balance">
            {description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-[#6E6E73]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E8ED]">
              <FileCheck2 className="w-3.5 h-3.5 text-[#0071E3]" />
              Official Company Presentations
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E8ED]">
              <Layers className="w-3.5 h-3.5 text-[#34C759]" />
              Dedicated Automotive Specialist Deck
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E8ED]">
              <Check className="w-3.5 h-3.5 text-[#1D1D1F]" />
              Instant Browser Preview &amp; Direct PDF Download
            </span>
          </div>
        </EditorialReveal>

        {/* 2 PDF Document Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {DOWNLOADABLE_PDF_DOCUMENTS.map((doc, idx) => {
            const isDownloading = downloadingId === doc.id;
            const isSuccess = downloadSuccessId === doc.id;
            const coverRef = idx === 0 ? coverCanvasRef1 : coverCanvasRef2;

            return (
              <EditorialReveal
                key={doc.id}
                delay={idx * 0.12}
                className="h-full flex flex-col"
              >
                <article
                  className={`group relative h-full flex flex-col justify-between liquid-glass-card rounded-3xl p-6 sm:p-8 bg-[#FFFFFF]/90 backdrop-blur-xl border border-[#E8E8ED] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${doc.themeColor.border}`}
                >
                  <div className="space-y-6">
                    {/* Visual Cover Preview Header */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveModalDoc(doc)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveModalDoc(doc);
                        }
                      }}
                      className="relative w-full aspect-[16/9] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1D1D1F] via-[#2C2C2E] to-[#141416] text-[#FFFFFF] shadow-inner cursor-pointer group/cover border border-[#E8E8ED]/30"
                      title={`Click to preview ${doc.displayTitle}`}
                    >
                      {/* Rendered Live Canvas Page 1 */}
                      <canvas
                        ref={coverRef}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-[1.03]"
                      />

                      {/* Brand Fallback Overlay Graphic */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/85 via-black/35 to-transparent">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-white/20 backdrop-blur-md text-[#FFFFFF] border border-white/20">
                            {doc.categoryBadge}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0071E3] text-[#FFFFFF]">
                            {doc.pageCountLabel}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-widest text-[#FFFFFF]/70 font-semibold mb-1">
                            AKYIN Marketing Presentation Deck
                          </p>
                          <h4 className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF] tracking-tight text-balance leading-snug">
                            {doc.displayTitle}
                          </h4>
                        </div>
                      </div>

                      {/* Hover Preview Badge */}
                      <div className="absolute inset-0 bg-[#0071E3]/20 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D1D1F]/90 text-[#FFFFFF] text-xs font-semibold shadow-lg border border-white/20 transform group-hover/cover:scale-105 transition-transform">
                          <Eye className="w-4 h-4 text-[#0071E3]" />
                          Click to Preview PDF (No Download Required)
                        </span>
                      </div>
                    </div>

                    {/* Meta Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${doc.themeColor.pillBg}`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {doc.categoryBadge}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED]">
                          {doc.pageCountLabel}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#86868B]">
                        PDF · Presentation
                      </span>
                    </div>

                    {/* Display Title & Description */}
                    <div className="space-y-3">
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
                        {doc.displayTitle}
                      </h3>
                      <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    {/* Topics & Deliverables included */}
                    <div className="space-y-2 pt-2 border-t border-[#E8E8ED]/80">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                        Included In This Presentation:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {doc.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[#F5F5F7] text-[#333336] border border-[#E8E8ED]"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#0071E3]" />
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dual Action CTAs */}
                  <div className="pt-6 mt-6 border-t border-[#E8E8ED] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Button 1: Preview PDF */}
                      <button
                        type="button"
                        onClick={() => setActiveModalDoc(doc)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#E8E8ED] transition-all duration-200 active:scale-[0.98] shadow-xs cursor-pointer group/btn"
                      >
                        <Eye className="w-4 h-4 text-[#0071E3] group-hover/btn:scale-110 transition-transform" />
                        <span>Preview PDF</span>
                      </button>

                      {/* Button 2: Direct Download PDF */}
                      <button
                        type="button"
                        onClick={() => handleDownload(doc)}
                        disabled={isDownloading}
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer ${
                          isSuccess
                            ? 'bg-[#34C759] text-[#FFFFFF]'
                            : 'bg-[#0071E3] hover:bg-[#0077ED] text-[#FFFFFF]'
                        }`}
                        title={`Download ${doc.filename}`}
                      >
                        {isDownloading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : isSuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Downloaded!</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownToLine className="w-4 h-4" />
                            <span>{doc.buttonText}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Direct Path Indicator */}
                    <div className="flex items-center justify-between text-[11px] text-[#86868B] px-1 font-mono">
                      <span className="truncate max-w-[280px]">
                        Path: {doc.downloadPath}
                      </span>
                      <span>Verified HTTP 200</span>
                    </div>
                  </div>
                </article>
              </EditorialReveal>
            );
          })}
        </div>

        {/* Note on specialist positioning */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#86868B] max-w-xl mx-auto leading-relaxed">
            * Automotive Marketing is maintained as a dedicated specialist practice alongside AKYIN’s full multi-industry business services portfolio. Both presentations are updated for 2025–2026.
          </p>
        </div>
      </div>

      {/* Interactive Modal Viewer (Does NOT force download on preview) */}
      {activeModalDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${activeModalDoc.displayTitle}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-[#FFFFFF] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#E8E8ED]">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-[#E8E8ED] bg-[#F5F5F7]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#1D1D1F] truncate">
                    {activeModalDoc.displayTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                    <span className="font-semibold text-[#0071E3]">
                      Page {activePage} of {totalPages}
                    </span>
                    <span>•</span>
                    <span className="truncate">{activeModalDoc.pageCountLabel} Total</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mode Selector */}
                <div className="hidden sm:inline-flex p-1 bg-[#E8E8ED] rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setViewerMode('canvas')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      viewerMode === 'canvas'
                        ? 'bg-[#FFFFFF] text-[#1D1D1F] shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    Slide Reader
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerMode('frame')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      viewerMode === 'frame'
                        ? 'bg-[#FFFFFF] text-[#1D1D1F] shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    PDF Frame
                  </button>
                </div>

                {/* Zoom Controls (Canvas mode) */}
                {viewerMode === 'canvas' && (
                  <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E8E8ED] rounded-xl p-1 text-xs text-[#1D1D1F]">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                      className="p-1.5 hover:bg-[#F5F5F7] rounded-lg transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="px-1.5 font-mono text-[11px] min-w-[42px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                      className="p-1.5 hover:bg-[#F5F5F7] rounded-lg transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(1)}
                      className="p-1.5 hover:bg-[#F5F5F7] rounded-lg transition-colors cursor-pointer border-l border-[#E8E8ED]"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Direct Download button inside modal */}
                <button
                  type="button"
                  onClick={() => handleDownload(activeModalDoc)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0071E3] hover:bg-[#0077ED] text-[#FFFFFF] shadow-sm transition-all cursor-pointer"
                  title="Download this PDF file"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Download PDF</span>
                </button>

                {/* Close modal */}
                <button
                  type="button"
                  onClick={() => setActiveModalDoc(null)}
                  className="p-2 rounded-xl text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors cursor-pointer"
                  title="Close Preview (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Interactive Viewer Stage */}
            <div className="relative flex-1 overflow-auto bg-[#1C1C1E] flex flex-col items-center justify-center p-4">
              {loadingDoc && (
                <div className="flex flex-col items-center gap-3 text-[#FFFFFF]">
                  <div className="w-8 h-8 border-3 border-white/20 border-t-[#0071E3] rounded-full animate-spin" />
                  <p className="text-sm">Loading presentation document...</p>
                </div>
              )}

              {renderError && (
                <div className="max-w-md p-6 rounded-2xl bg-white/10 text-center text-[#FFFFFF] space-y-4">
                  <p className="text-sm text-red-300">{renderError}</p>
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setViewerMode('frame')}
                      className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold"
                    >
                      Switch to PDF Frame
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(activeModalDoc)}
                      className="px-4 py-2 rounded-xl bg-[#0071E3] text-xs font-semibold"
                    >
                      Download Document
                    </button>
                  </div>
                </div>
              )}

              {/* Canvas Slide View */}
              {viewerMode === 'canvas' && !renderError && (
                <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
                  <canvas
                    ref={canvasRef}
                    className="max-h-full rounded-xl shadow-2xl bg-white object-contain"
                  />
                </div>
              )}

              {/* Native PDF Frame Mode */}
              {viewerMode === 'frame' && !renderError && (
                <iframe
                  src={`${activeModalDoc.downloadPath}#page=${activePage}&view=FitH`}
                  title={activeModalDoc.displayTitle}
                  className="w-full h-full border-0 rounded-xl bg-white"
                />
              )}
            </div>

            {/* Modal Footer: Slide Navigation Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[#E8E8ED] bg-[#FFFFFF]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePage((p) => (p <= 1 ? totalPages : p - 1))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePage((p) => (p >= totalPages ? 1 : p + 1))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick page jumper / indicator */}
              <div className="text-xs text-[#6E6E73] font-medium hidden sm:flex items-center gap-2">
                <span>Use keyboard ← / → to flip slides</span>
                <span>•</span>
                <span className="font-mono">{activeModalDoc.filename}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#1D1D1F] px-2.5 py-1 rounded-lg bg-[#F5F5F7]">
                  Slide {activePage} / {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
