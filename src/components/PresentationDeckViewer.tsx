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
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { PresentationDeckConfig } from '../data/presentationDecks';
import { GlassButton, GlassModal, GlassPanel } from './liquid-glass';

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
  const [fullScreenOpen, setFullScreenOpen] = useState(false);

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);

  const inlineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const modalRenderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

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

    loadingTask.promise
      .then((doc) => {
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
        if (cancelled) return;
        console.error('Failed to load PDF presentation:', err);
        setPdfError('Interactive slide rendering unavailable; switch to PDF Frame or Download PDF.');
        setLoadingPdf(false);
      });

    return () => {
      cancelled = true;
      if (loadedDoc) {
        void loadedDoc.cleanup();
      } else {
        void loadingTask.destroy();
      }
    };
  }, [activeDeck.pdfUrl]);

  // Helper to paint a PDF page onto a target canvas cleanly
  const renderPageToCanvas = useCallback(
    async (
      doc: pdfjsLib.PDFDocumentProxy,
      pageNum: number,
      canvas: HTMLCanvasElement,
      taskSlot: React.MutableRefObject<pdfjsLib.RenderTask | null>,
      zoomLevel: number
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
        const containerWidth = canvas.parentElement?.clientWidth || 960;
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.max(0.6, (containerWidth - 4) / baseViewport.width);
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

  // Paint inline stage canvas
  useEffect(() => {
    if (!pdfDoc || viewMode !== 'canvas' || !inlineCanvasRef.current) return;
    void renderPageToCanvas(
      pdfDoc,
      activeSlide,
      inlineCanvasRef.current,
      renderTaskRef,
      zoom
    );
  }, [pdfDoc, activeSlide, zoom, viewMode, renderPageToCanvas]);

  // Paint fullscreen modal canvas when modal is open
  useEffect(() => {
    if (!pdfDoc || !fullScreenOpen || !modalCanvasRef.current) return;
    void renderPageToCanvas(
      pdfDoc,
      activeSlide,
      modalCanvasRef.current,
      modalRenderTaskRef,
      Math.max(zoom, 1)
    );
  }, [pdfDoc, activeSlide, zoom, fullScreenOpen, renderPageToCanvas]);

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
          zoom
        );
      }
      if (fullScreenOpen && modalCanvasRef.current) {
        void renderPageToCanvas(
          pdfDoc,
          activeSlide,
          modalCanvasRef.current,
          modalRenderTaskRef,
          Math.max(zoom, 1)
        );
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [pdfDoc, activeSlide, zoom, viewMode, fullScreenOpen, renderPageToCanvas]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev <= 1 ? totalPages : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev >= totalPages ? 1 : prev + 1));
  };

  const handleDownloadPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const response = await fetch(activeDeck.pdfUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = activeDeck.downloadFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      // Fallback direct anchor download
      const a = document.createElement('a');
      a.href = activeDeck.pdfUrl;
      a.download = activeDeck.downloadFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
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
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

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

        {/* Viewer Card */}
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`${activeDeck.title} presentation viewer`}
          className="rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/30"
        >
          <GlassPanel className="p-5 sm:p-8 space-y-6">
          {/* Top Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E8E8ED]">
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
                    disabled={zoom >= 1.5}
                    onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.25).toFixed(2))))}
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

              {/* Fullscreen Reader */}
              <GlassButton
                variant="glass"
                size="sm"
                onClick={() => setFullScreenOpen(true)}
                aria-label="Open full-screen presentation viewer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full Screen</span>
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

          {/* Embedded Presentation Stage */}
          {viewMode === 'canvas' ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl border border-[#E8E8ED] bg-[#FFFFFF] overflow-auto shadow-inner">
                {loadingPdf && (
                  <div className="aspect-[16/9] flex flex-col items-center justify-center gap-3 p-8 text-center bg-gradient-to-br from-[#F5F5F7] to-[#E8E8ED]/50">
                    <div className="w-8 h-8 rounded-full border-2 border-[#1D1D1F]/20 border-t-[#1D1D1F] animate-spin" />
                    <p className="text-sm font-medium text-[#6E6E73]">
                      Loading {activeDeck.label} ({totalPages} slides)...
                    </p>
                  </div>
                )}

                {!loadingPdf && pdfError && (
                  <div className="aspect-[16/9] bg-gradient-to-br from-[#F5F5F7] to-[#E8E8ED] p-8 sm:p-12 flex flex-col justify-between">
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
                  className={`flex justify-center items-center min-h-[260px] ${
                    loadingPdf || pdfError ? 'hidden' : 'block'
                  }`}
                >
                  <canvas
                    ref={inlineCanvasRef}
                    className="block max-w-none mx-auto"
                    aria-label={`${activeDeck.label} Slide ${activeSlide}`}
                  />
                </div>
              </div>

              {/* Current Slide Caption Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                <div>
                  <p className="font-display text-sm font-bold text-[#1D1D1F]">
                    {currentMeta.title}
                  </p>
                  <p className="text-xs text-[#6E6E73]">{currentMeta.subtitle}</p>
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
            <div className="rounded-2xl border border-[#E8E8ED] overflow-hidden bg-white shadow-inner">
              <iframe
                key={`${activeDeck.pdfUrl}-${activeSlide}`}
                src={`${activeDeck.pdfUrl}#page=${activeSlide}&view=FitH`}
                title={`${activeDeck.title} — Page ${activeSlide}`}
                className="w-full h-[520px] sm:h-[620px] border-0"
              />
            </div>
          )}

          {/* Slide Quick-Jump Strip (1–19) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-[#6E6E73]">
              <span>Jump to slide (1–{totalPages}) · Use Left/Right arrow keys</span>
              <span className="font-mono-num tabular-nums font-semibold">
                {activeSlide} / {totalPages}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((slideNum) => {
                const isActive = activeSlide === slideNum;
                return (
                  <button
                    key={slideNum}
                    type="button"
                    onClick={() => setActiveSlide(slideNum)}
                    aria-label={`Go to slide ${slideNum}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`min-w-[38px] px-3 py-2 rounded-xl text-xs font-mono-num tabular-nums font-bold transition-all shrink-0 cursor-pointer ${
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
          </GlassPanel>
        </div>
      </div>

      {/* Fullscreen Reader Modal */}
      <GlassModal
        open={fullScreenOpen}
        onClose={() => setFullScreenOpen(false)}
        subtitle={`Slide ${activeSlide} of ${totalPages}`}
        title={activeDeck.title}
        maxWidthClass="max-w-6xl"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E8E8ED] bg-white overflow-auto max-h-[68vh] flex justify-center items-center p-2">
            {pdfDoc ? (
              <canvas
                ref={modalCanvasRef}
                className="block max-w-full h-auto"
                aria-label={`${activeDeck.label} Fullscreen Slide ${activeSlide}`}
              />
            ) : (
              <iframe
                src={`${activeDeck.pdfUrl}#page=${activeSlide}&view=FitH`}
                title={`${activeDeck.title} Fullscreen`}
                className="w-full h-[65vh] border-0"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="space-y-0.5 max-w-xl">
              <p className="text-sm font-bold text-[#1D1D1F]">{currentMeta.title}</p>
              <p className="text-xs text-[#6E6E73]">{currentMeta.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="glass" size="sm" onClick={prevSlide}>
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </GlassButton>
              <GlassButton variant="glass" size="sm" onClick={nextSlide}>
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </GlassButton>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={downloading}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? 'Preparing...' : 'Download PDF'}</span>
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassModal>
    </section>
  );
}
