import { useEffect, useState } from 'react';
import {
  Captions,
  Car,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { IMAGES } from '../data/akyinData';
import { GlassPanel } from './liquid-glass';
import { ResilientImage } from './ResilientImage';

interface VideoReelStory {
  id: string;
  managerName: string;
  role: string;
  dealership: string;
  city: string;
  category: string;
  durationSec: number;
  headlineMetric: string;
  metricLabel: string;
  transcriptCaptions: string[];
  accentBg: string;
  posterImage: string;
}

const VIDEO_TESTIMONIAL_REELS: VideoReelStory[] = [
  {
    id: 'reel-autoclub',
    managerName: 'Praveen Rajagopalan',
    role: 'Managing Director',
    dealership: 'AutoClub Multi-Brand Showrooms',
    city: 'Bengaluru',
    category: 'Lead Volume & Filtering',
    durationSec: 12,
    headlineMetric: '+42% Test Drives',
    metricLabel: 'In 60 Days',
    transcriptCaptions: [
      'Before AKYIN, our sales executives dialed dozens of unfiltered social enquiries every morning.',
      'By separating ad generation from dedicated qualification screening, only showroom-ready buyers reach our floor.',
      'Weekend test-drive completions jumped 42% while cutting cost per qualified booking by 31%.',
    ],
    accentBg: 'from-purple-100/70 via-white to-amber-50/60',
    posterImage: IMAGES.salesTraining,
  },
  {
    id: 'reel-crestline',
    managerName: 'Vikramaditya Rao',
    role: 'Dealer Principal',
    dealership: 'Crestline Motors & Pre-Owned',
    city: 'Hyderabad',
    category: 'Sales Team Training',
    durationSec: 12,
    headlineMetric: '-38% Lead Cost',
    metricLabel: 'Festive Exchange Peak',
    transcriptCaptions: [
      'Festive season footfalls used to depend purely on walk-ins and newspaper circulars.',
      'AKYIN deployed geo-fenced exchange valuation campaigns alongside on-site phone script coaching.',
      'Our consultants raised showroom show-up rates to 71% across both new and certified pre-owned divisions.',
    ],
    accentBg: 'from-amber-50/70 via-white to-purple-100/60',
    posterImage: IMAGES.heroShowroom,
  },
  {
    id: 'reel-auramobility',
    managerName: 'Nikhil Deshmukh',
    role: 'Head of Sales Operations',
    dealership: 'Aura EV & Luxury Mobility',
    city: 'Pune & Mumbai',
    category: 'Digital Presence',
    durationSec: 12,
    headlineMetric: '3.1x CRM Speed',
    metricLabel: 'Luxury EV Launches',
    transcriptCaptions: [
      'Luxury EV shoppers compare showrooms rapidly and expect instant model walkthroughs.',
      'With AKYIN’s Google Local Map optimization and WhatsApp test-drive routing, response times dropped 3.1x.',
      'Every showroom manager now tracks daily target progress inside one unified portal.',
    ],
    accentBg: 'from-indigo-50/70 via-white to-rose-50/60',
    posterImage: IMAGES.automotiveHeritage,
  },
];

export function VideoSuccessStories() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [elapsedSec, setElapsedSec] = useState(0);

  const activeReel = VIDEO_TESTIMONIAL_REELS[activeIndex];
  const captionStep = Math.min(
    activeReel.transcriptCaptions.length - 1,
    Math.floor((elapsedSec / activeReel.durationSec) * activeReel.transcriptCaptions.length)
  );
  const progressPercent = Math.min(100, (elapsedSec / activeReel.durationSec) * 100);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setElapsedSec((prev) => {
        if (prev + 0.25 >= activeReel.durationSec) {
          setActiveIndex((idx) => (idx + 1) % VIDEO_TESTIMONIAL_REELS.length);
          return 0;
        }
        return prev + 0.25;
      });
    }, 250);
    return () => window.clearInterval(interval);
  }, [isPlaying, activeReel.durationSec]);

  const handleSelectReel = (idx: number) => {
    setActiveIndex(idx);
    setElapsedSec(0);
    setIsPlaying(true);
  };

  return (
    <section
      id="video-success-stories"
      className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full frosted-glass-pill text-xs font-semibold text-[#1D1D1F]">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
              <span>Auto-Playing Dealership Manager Reels</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
              Video Success Stories.
            </h2>
            <p className="text-base text-[#6E6E73] leading-relaxed">
              Watch auto-playing visual testimonial highlights from automotive dealership managers sharing showroom lead-quality and test-drive improvements.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setShowCaptions((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                showCaptions
                  ? 'liquid-glass-pill-dark text-white border-[#1D1D1F]'
                  : 'frosted-glass-pill text-[#1D1D1F] border-[#E8E8ED]'
              }`}
            >
              <Captions className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{showCaptions ? 'Captions On' : 'Captions Off'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? 'Pause testimonial reel' : 'Play testimonial reel'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold frosted-glass-pill text-[#1D1D1F] hover:bg-white transition-all cursor-pointer border border-[#E8E8ED]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Pause Reel</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>
          </div>
        </div>

        <GlassPanel className="p-5 sm:p-8 bg-gradient-to-br from-white via-[#F5F5F7] to-purple-50/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Main Auto-Playing Visual Reel Viewport */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div
                className={`relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/90 shadow-lg bg-gradient-to-br ${activeReel.accentBg}`}
              >
                {/* Animated Showroom Ambient Scene */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeReel.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.03 }}
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 1,
                            scale: isPlaying ? [1.02, 1.07, 1.02] : 1.02,
                          }
                    }
                    exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.45 },
                      scale: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    className="absolute inset-0"
                  >
                    <ResilientImage
                      src={activeReel.posterImage}
                      alt={`${activeReel.dealership} dealership testimonial reel`}
                      fallbackTitle={activeReel.dealership}
                      className="w-full h-full opacity-90"
                      imageClassName="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/35 to-white/25" />
                  </motion.div>
                </AnimatePresence>

                {/* Top Reel Overlay Header */}
                <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full frosted-glass border border-white/90 text-xs font-semibold text-[#1D1D1F]">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isPlaying ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      <span>{activeReel.category}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full frosted-glass border border-purple-200/80 text-xs font-bold text-purple-800">
                      <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="font-mono-num">{activeReel.headlineMetric}</span>
                      <span className="font-normal text-[#6E6E73]">· {activeReel.metricLabel}</span>
                    </div>
                  </div>

                  {/* Center Dealership Manager Card & Animated Caption Strip */}
                  <div className="space-y-4 mt-auto">
                    {showCaptions && (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${activeReel.id}-${captionStep}`}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                          className="frosted-glass rounded-2xl p-4 sm:p-5 border border-white/95 shadow-md max-w-2xl"
                        >
                          <p className="text-sm sm:text-base font-semibold text-[#1D1D1F] leading-relaxed">
                            “{activeReel.transcriptCaptions[captionStep]}”
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#1D1D1F] text-white flex items-center justify-center font-display text-sm font-bold shrink-0">
                          {activeReel.managerName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-display text-sm sm:text-base font-bold text-[#1D1D1F]">
                            {activeReel.managerName} · {activeReel.role}
                          </p>
                          <p className="text-xs text-[#6E6E73]">
                            {activeReel.dealership} ({activeReel.city})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* Subtle Animated Voice Waveform */}
                        <div className="flex items-end gap-0.5 h-4 px-2" aria-hidden="true">
                          {[0.4, 0.9, 0.6, 1, 0.5].map((h, i) => (
                            <motion.span
                              key={i}
                              animate={
                                isPlaying && !shouldReduceMotion
                                  ? { height: [`${h * 6}px`, `${h * 16}px`, `${h * 6}px`] }
                                  : { height: '5px' }
                              }
                              transition={{
                                duration: 0.7,
                                repeat: Infinity,
                                delay: i * 0.12,
                              }}
                              className="w-1 rounded-full bg-purple-700/75"
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setElapsedSec(0);
                            setIsPlaying(true);
                          }}
                          aria-label="Restart current reel"
                          className="w-8 h-8 rounded-full frosted-glass-pill flex items-center justify-center text-[#1D1D1F] hover:bg-white cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="font-mono-num text-xs font-semibold text-[#1D1D1F]">
                          0:{String(Math.floor(elapsedSec)).padStart(2, '0')} / 0:{activeReel.durationSec}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#1D1D1F]/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1D1D1F] via-purple-700 to-amber-600 transition-all duration-200 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Reel Selector Stack */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-3">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] px-1">
                  Up Next · Dealership Testimonials
                </p>
                {VIDEO_TESTIMONIAL_REELS.map((reel, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <button
                      key={reel.id}
                      type="button"
                      onClick={() => handleSelectReel(idx)}
                      className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer border ${
                        selected
                          ? 'liquid-glass-pill-dark text-white border-[#1D1D1F] shadow-md'
                          : 'bg-white/85 hover:bg-white text-[#1D1D1F] border-[#E8E8ED]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              selected ? 'text-purple-200' : 'text-purple-700'
                            }`}
                          >
                            {reel.category}
                          </span>
                          <p className="font-display text-sm font-bold truncate">
                            {reel.dealership}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              selected ? 'text-white/75' : 'text-[#6E6E73]'
                            }`}
                          >
                            {reel.managerName} · {reel.city}
                          </p>
                        </div>
                        <span
                          className={`font-mono-num text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                            selected
                              ? 'bg-white/15 text-white'
                              : 'bg-[#F5F5F7] text-[#1D1D1F]'
                          }`}
                        >
                          {reel.headlineMetric}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="frosted-glass rounded-2xl p-4 border border-[#E8E8ED] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1D1D1F]">
                  <Car className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                  <span>Dealership Video Showcase</span>
                </div>
                <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                  Cycles automatically through featured multi-brand showroom, certified pre-owned, and luxury EV manager stories.
                </p>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
