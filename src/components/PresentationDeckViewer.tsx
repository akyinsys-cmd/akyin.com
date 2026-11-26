import { useCallback, useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Maximize2,
  Minimize2,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { PresentationDeckConfig } from '../data/presentationDecks';
import { GlassButton, GlassPanel } from './liquid-glass';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PresentationDeckViewerProps {
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  decks: PresentationDeckConfig[];
  initialDeckId?: PresentationDeckConfig['id'];
  backgroundClass?: string;
}

type ViewMode = 'canvas' | 'native';

export function PresentationDeckViewer({
  sectionId = 'presentation-viewer',
  eyebrow = 'Official 19-Slide Presentation Viewer',
  heading = 'Explore Our Company Presentation',
  subheading = 'Browse every slide directly inside the page, zoom in, expand to full-screen reader mode, or download the PDF.',
  decks,
  initialDeckId,
  backgroundClass = 'bg-[#F5F5F7]',
}: PresentationDeckViewerProps) {
  const [selectedDeckId, setSelectedDeckId] = useState<PresentationDeckConfig['id']>(
    initialDeckId ?? decks[0]?.id ?? 'automotive'
  );
  const activeDeck =
    decks.find((d) => d.id === selectedDeckId) ?? decks[0];

  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(activeDeck.slides.length || 19);
  const [zoom, setZoom] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);

  const inlineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageScrollRef = useRef<HTMLDivElement | null>(null);
  const viewerRootRef = useRef<HTMLDivElement | null>(null);
  const wasNativeFsRef = useRef<boolean>(false);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  // Switch deck resets to slide 1 & default zoom
  const handleSelectDeck = (deckId: PresentationDeckConfig['id']) => {
    setSelectedDeckId(deckId);
    setActiveSlide(1);
    setZoom(1);
  };

  // Load PDF document whenever activeDeck.pdfUrl changes
  useEffect(() => {
    let cancelled = false;
    let loadedDoc: pdfjsLib.PDFDocumentProxy | null = null;

    setLoadingPdf(true);
    setPdfError('');
    setPdfDoc(null);

    const loadingTask = pdfjsLib.getDocument({
      url: activeDeck.pdfUrl,
      disableAutoFetch: false,
    });

    const loadTimeoutId = window.setTimeout(() => {
      if (cancelled) return;
      void loadingTask.destroy();
      setPdfError('Presentation preview timed out; switch to PDF Frame or Download PDF.');
      setLoadingPdf(false);
    }, 15000);

    loadingTask.promise
      .then((doc) => {
        window.clearTimeout(loadTimeoutId);
        if (cancelled) {
          void doc.cleanup();
          return;
        }
        loadedDoc = doc;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setActiveSlide((prev) => Math.min(Math.max(1, prev), doc.numPages));
        setLoadingPdf(false);
      })
      .catch((err) => {
        window.clearTimeout(loadTimeoutId);
        if (cancelled) return;
        console.error('Failed to load PDF presentation:', err);
        setPdfError('Interactive slide rendering unavailable; switch to PDF Frame or Download PDF.');
        setLoadingPdf(false);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(loadTimeoutId);
      if (loadedDoc) {
        void loadedDoc.cleanup();
      } else {
        void loadingTask.destroy();
      }
    };
  }, [activeDeck.pdfUrl]);

  // Sync browser Fullscreen API state with React UI
  useEffect(() => {
    const onFullscreenChange = () => {
      const isNativeActive = document.fullscreenElement === viewerRootRef.current;
      if (isNativeActive) {
        wasNativeFsRef.current = true;
        setIsFullscreen(true);
      } else if (wasNativeFsRef.current) {
        wasNativeFsRef.current = false;
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const targetEl = viewerRootRef.current;
    if (!isFullscreen) {
      if (targetEl?.requestFullscreen) {
        try {
          await targetEl.requestFullscreen();
        } catch {
          // Graceful CSS full-viewport expansion when nested iframe blocks native Fullscreen API
        }
      }
      setIsFullscreen(true);
      return;
    }

    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {
        // Ignore if already exited
      }
    }
    setIsFullscreen(false);
  }, [isFullscreen]);

  // Lock body scroll and listen for Escape when full-viewport reader is active
  useEffect(() => {
    if (!isFullscreen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (document.fullscreenElement && document.exitFullscreen) {
          void document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveSlide((prev) => (prev <= 1 ? totalPages : prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveSlide((prev) => (prev >= totalPages ? 1 : prev + 1));
      }
    };

    window.addEventListener('keydown', onWindowKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onWindowKeyDown);
    };
  }, [isFullscreen, totalPages]);

  // Helper to paint a PDF page onto the stage canvas cleanly
  const renderPageToCanvas = useCallback(
    async (
      doc: pdfjsLib.PDFDocumentProxy,
      pageNum: number,
      canvas: HTMLCanvasElement,
      taskSlot: React.MutableRefObject<pdfjsLib.RenderTask | null>,
      zoomLevel: number,
      fullscreenMode: boolean
    ) => {
      if (taskSlot.current) {
        try {
          taskSlot.current.cancel();
        } catch {
          // ignore cancelled render
        }
      }

      try {
        const page = await doc.getPage(pageNum);
        const scrollBox = stageScrollRef.current;
        const containerWidth =
          scrollBox?.clientWidth ||
          canvas.parentElement?.clientWidth ||
          (fullscreenMode ? window.innerWidth - 48 : 960);
        const baseViewport = page.getViewport({ scale: 1 });

        let fitScale: number;
        if (fullscreenMode) {
          const containerHeight =
            scrollBox?.clientHeight || Math.max(window.innerHeight - 230, 320);
          const widthScale = (containerWidth - 24) / baseViewport.width;
          const heightScale = (containerHeight - 24) / baseViewport.height;
          fitScale = Math.max(0.5, Math.min(widthScale, heightScale));
        } else {
          fitScale = Math.max(0.6, (containerWidth - 4) / baseViewport.width);
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const targetScale = fitScale * zoomLevel;

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
        taskSlot.current = task;
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

  // Paint stage canvas on slide, zoom, mode, or fullscreen transitions
  useEffect(() => {
    if (!pdfDoc || viewMode !== 'canvas' || !inlineCanvasRef.current) return;
    const rafId = window.requestAnimationFrame(() => {
      if (!inlineCanvasRef.current) return;
      void renderPageToCanvas(
        pdfDoc,
        activeSlide,
        inlineCanvasRef.current,
        renderTaskRef,
        zoom,
        isFullscreen
      );
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [pdfDoc, activeSlide, zoom, viewMode, isFullscreen, renderPageToCanvas]);

  // Re-render on window resize so canvas stays fitted smoothly
  useEffect(() => {
    if (!pdfDoc) return;
    const onResize = () => {
      if (viewMode === 'canvas' && inlineCanvasRef.current) {
        void renderPageToCanvas(
          pdfDoc,
          activeSlide,
          inlineCanvasRef.current,
          renderTaskRef,
          zoom,
          isFullscreen
        );
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [pdfDoc, activeSlide, zoom, viewMode, isFullscreen, renderPageToCanvas]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev <= 1 ? totalPages : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev >= totalPages ? 1 : prev + 1));
  };

  const handleDownloadPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(activeDeck.pdfUrl, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('Unexpected HTML response instead of PDF');
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = activeDeck.downloadFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      const a = document.createElement('a');
      a.href = activeDeck.pdfUrl;
      a.download = activeDeck.downloadFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      window.clearTimeout(timeoutId);
      setDownloading(false);
    }
  };

  const currentMeta =
    activeDeck.slides[activeSlide - 1] ?? {
      slide: activeSlide,
      title: activeDeck.title,
      subtitle: activeDeck.description,
    };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFullscreen) return; // Handled cleanly by window listener when expanded
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  const viewerContent = (
    <div
      className={
        isFullscreen
          ? 'flex flex-col flex-1 min-h-0 gap-4'
          : 'space-y-6'
      }
    >
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E8ED] shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono-num tabular-nums text-xs sm:text-sm font-bold bg-[#1D1D1F] text-white px-3.5 py-1.5 rounded-xl whitespace-nowrap">
            Slide {activeSlide} of {totalPages}
          </span>
          <div className="text-xs text-[#6E6E73]">
            <span className="font-semibold text-[#1D1D1F]">{activeDeck.label}</span>
            <span className="hidden sm:inline"> · {activeDeck.downloadFilename}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div
            role="group"
            aria-label="Presentation render mode"
            className="inline-flex p-1 rounded-xl bg-white border border-[#E8E8ED]"
          >
            <button
              type="button"
              onClick={() => setViewMode('canvas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                viewMode === 'canvas'
                  ? 'bg-[#1D1D1F] text-white'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Slide Reader
            </button>
            <button
              type="button"
              onClick={() => setViewMode('native')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                viewMode === 'native'
                  ? 'bg-[#1D1D1F] text-white'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              PDF Frame
            </button>
          </div>

          {/* Zoom Controls (in Slide Reader mode) */}
          {viewMode === 'canvas' && (
            <div className="hidden sm:inline-flex items-center gap-1 bg-white border border-[#E8E8ED] rounded-xl px-1.5 py-1">
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoom <= 0.75}
                onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))))}
                className="p-1.5 rounded-lg text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-40 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono-num tabular-nums text-xs font-semibold px-1.5 text-[#1D1D1F]">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoom >= 1.75}
                onClick={() => setZoom((z) => Math.min(1.75, Number((z + 0.25).toFixed(2))))}
                className="p-1.5 rounded-lg text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-40 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {zoom !== 1 && (
                <button
                  type="button"
                  aria-label="Reset zoom"
                  onClick={() => setZoom(1)}
                  className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Prev / Next */}
          <GlassButton variant="glass" size="sm" onClick={prevSlide}>
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </GlassButton>
          <GlassButton variant="glass" size="sm" onClick={nextSlide}>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </GlassButton>

          {/* Fullscreen Toggle */}
          <GlassButton
            variant={isFullscreen ? 'primary' : 'glass'}
            size="sm"
            onClick={() => {
              void toggleFullscreen();
            }}
            aria-pressed={isFullscreen}
            aria-label={
              isFullscreen
                ? 'Exit full-screen presentation viewer'
                : 'Expand presentation viewer to full screen'
            }
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span className={isFullscreen ? 'inline' : 'hidden md:inline'}>
              {isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
            </span>
          </GlassButton>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1D1D1F] text-white hover:bg-[#1D1D1F]/90 transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{downloading ? 'Preparing...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Presentation Stage */}
      {viewMode === 'canvas' ? (
        <div
          className={
            isFullscreen
              ? 'flex flex-col flex-1 min-h-0 gap-3'
              : 'space-y-4'
          }
        >
          <div
            className={`rounded-2xl border border-[#1D1D1F]/10 ring-1 ring-[#1D1D1F]/[0.03] bg-[#FFFFFF] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${
              isFullscreen ? 'flex flex-col flex-1 min-h-0' : ''
            }`}
          >
            {/* Subtle Apple-style Viewer Guidance & Zoom Indicator */}
            <div className="bg-[#F5F5F7]/85 backdrop-blur-md border-b border-[#1D1D1F]/8 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6E6E73] shrink-0">
              <div className="inline-flex items-center gap-2">
                <Move className="w-3.5 h-3.5 text-[#1D1D1F]/70 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-[#1D1D1F]">Interactive PDF Preview:</span>{' '}
                  {zoom > 1
                    ? 'Scroll horizontally or vertically to inspect slide details'
                    : 'Zoom in and scroll within the preview frame'}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono-num tabular-nums text-[11px] text-[#1D1D1F]">
                <span>Zoom {Math.round(zoom * 100)}%</span>
                {zoom === 1 && (
                  <button
                    type="button"
                    onClick={() => setZoom(1.25)}
                    className="font-sans font-semibold text-[#0071E3] hover:underline cursor-pointer"
                  >
                    Zoom 125%
                  </button>
                )}
              </div>
            </div>

            <div
              ref={stageScrollRef}
              className={`relative bg-[#FFFFFF] overflow-auto ${
                isFullscreen ? 'flex-1 min-h-0 flex p-2 sm:p-4' : 'max-h-[72vh]'
              }`}
            >
              {loadingPdf && (
                <div className="aspect-[16/9] w-full flex flex-col items-center justify-center gap-3 p-8 text-center bg-gradient-to-br from-[#F5F5F7] to-[#E8E8ED]/50">
                  <div className="w-8 h-8 rounded-full border-2 border-[#1D1D1F]/20 border-t-[#1D1D1F] animate-spin" />
                  <p className="text-sm font-medium text-[#6E6E73]">
                    Loading {activeDeck.label} ({totalPages} slides)...
                  </p>
                </div>
              )}

              {!loadingPdf && pdfError && (
                <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#F5F5F7] to-[#E8E8ED] p-8 sm:p-12 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                    <span>Slide {activeSlide} · {activeDeck.label}</span>
                    <span className="font-mono-num font-bold">{totalPages} Slides Total</span>
                  </div>
                  <div className="space-y-3 my-auto max-w-2xl">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                      {currentMeta.title}
                    </h3>
                    <p className="text-base text-[#6E6E73] leading-relaxed">
                      {currentMeta.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setViewMode('native')}
                      className="px-4 py-2 rounded-xl bg-white border border-[#E8E8ED] text-xs font-semibold text-[#1D1D1F] cursor-pointer"
                    >
                      Switch to PDF Frame
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="px-4 py-2 rounded-xl bg-[#1D1D1F] text-white text-xs font-semibold cursor-pointer"
                    >
                      Download Full PDF
                    </button>
                  </div>
                </div>
              )}

              <div
                className={`flex justify-center items-center ${
                  isFullscreen ? 'min-h-0 m-auto' : 'min-h-[260px]'
                } ${loadingPdf || pdfError ? 'hidden' : 'block'}`}
              >
                <canvas
                  ref={inlineCanvasRef}
                  className="block max-w-none mx-auto"
                  aria-label={`${activeDeck.label} Slide ${activeSlide}`}
                />
              </div>
            </div>
          </div>

          {/* Current Slide Caption Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 shrink-0">
            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-[#1D1D1F] truncate">
                {currentMeta.title}
              </p>
              <p className="text-xs text-[#6E6E73] truncate">{currentMeta.subtitle}</p>
            </div>
            <a
              href={activeDeck.pdfUrl}
              download={activeDeck.downloadFilename}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Direct PDF Link</span>
            </a>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-2xl border border-[#1D1D1F]/10 ring-1 ring-[#1D1D1F]/[0.03] overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${
            isFullscreen ? 'flex-1 min-h-0 flex flex-col' : ''
          }`}
        >
          <div className="bg-[#F5F5F7]/85 backdrop-blur-md border-b border-[#1D1D1F]/8 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6E6E73] shrink-0">
            <div className="inline-flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-[#1D1D1F]/70 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-semibold text-[#1D1D1F]">Embedded PDF Reader:</span>{' '}
                Scroll pages and adjust zoom directly inside the document frame
              </span>
            </div>
            <span className="font-mono-num tabular-nums text-[11px] text-[#1D1D1F]">
              Page {activeSlide} of {totalPages}
            </span>
          </div>
          <iframe
            key={`${activeDeck.pdfUrl}-${activeSlide}`}
            src={`${activeDeck.pdfUrl}#page=${activeSlide}&view=FitH`}
            title={`${activeDeck.title} — Page ${activeSlide}`}
            className={
              isFullscreen
                ? 'w-full flex-1 min-h-0 border-0'
                : 'w-full h-[520px] sm:h-[620px] border-0'
            }
          />
        </div>
      )}

      {/* Slide Quick-Jump Strip (1–19) */}
      <div className="space-y-1.5 pt-1 shrink-0">
        <div className="flex items-center justify-between text-xs text-[#6E6E73]">
          <span>
            Jump to slide (1–{totalPages}) · Use Left/Right arrow keys
            {isFullscreen ? ' · Press Esc to exit' : ''}
          </span>
          <span className="font-mono-num tabular-nums font-semibold">
            {activeSlide} / {totalPages}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((slideNum) => {
            const isActive = activeSlide === slideNum;
            return (
              <button
                key={slideNum}
                type="button"
                onClick={() => setActiveSlide(slideNum)}
                aria-label={`Go to slide ${slideNum}`}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[38px] px-3 py-1.5 rounded-xl text-xs font-mono-num tabular-nums font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1D1D1F] text-white shadow-xs'
                    : 'bg-white text-[#6E6E73] hover:bg-white/80 hover:text-[#1D1D1F] border border-[#E8E8ED]'
                }`}
              >
                {slideNum}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section
      id={sectionId}
      className={`py-20 lg:py-28 ${backgroundClass} border-t border-[#E8E8ED]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6E6E73]">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
            {heading}
          </h2>
          <p className="text-base text-[#6E6E73] leading-relaxed">{subheading}</p>
        </div>

        {/* Deck Selector (shown cleanly when multiple decks are available) */}
        {decks.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {decks.map((deck) => {
              const selected = deck.id === activeDeck.id;
              return (
                <button
                  key={deck.id}
                  type="button"
                  onClick={() => handleSelectDeck(deck.id)}
                  className={`text-left rounded-2xl p-5 transition-all cursor-pointer border ${
                    selected
                      ? 'liquid-glass-panel border-[#1D1D1F] shadow-md bg-white'
                      : 'bg-white/75 border-[#E8E8ED] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-purple-700">
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{deck.badge}</span>
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        selected ? 'text-[#1D1D1F]' : 'text-[#6E6E73]'
                      }`}
                    >
                      {selected ? 'Active Deck' : 'Select Deck'}
                    </span>
                  </div>
                  <p className="font-display text-base sm:text-lg font-bold text-[#1D1D1F] mt-1.5">
                    {deck.label}
                  </p>
                  <p className="text-xs text-[#6E6E73] mt-1 line-clamp-2">
                    {deck.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Viewer Container: Embedded Card or Full-Viewport Expansion */}
        <div
          ref={viewerRootRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`${activeDeck.title} presentation viewer`}
          role={isFullscreen ? 'dialog' : undefined}
          aria-modal={isFullscreen ? true : undefined}
          className={
            isFullscreen
              ? 'fixed inset-0 z-[70] w-screen h-[100dvh] bg-[#1D1D1F]/92 backdrop-blur-2xl p-3 sm:p-5 flex flex-col focus-visible:outline-none'
              : 'rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/30'
          }
        >
          {isFullscreen ? (
            <div className="flex-1 min-h-0 flex flex-col rounded-2xl sm:rounded-3xl bg-[#F5F5F7] border border-white/25 p-4 sm:p-6 shadow-2xl overflow-hidden">
              {viewerContent}
            </div>
          ) : (
            <GlassPanel className="p-5 sm:p-8">{viewerContent}</GlassPanel>
          )}
        </div>
      </div>
    </section>
  );
}
