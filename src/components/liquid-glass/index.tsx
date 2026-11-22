import { ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

interface LiquidGlassHeaderProps {
  scrolled?: boolean;
  children: ReactNode;
  className?: string;
}

export function LiquidGlassHeader({
  scrolled = false,
  children,
  className = '',
}: LiquidGlassHeaderProps) {
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 text-[#1D1D1F] print:hidden ${
        scrolled ? 'liquid-glass-nav-scrolled' : 'liquid-glass-nav'
      } ${className}`}
    >
      {children}
    </header>
  );
}

interface GlassNavigationProps {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export function GlassNavigation({
  children,
  ariaLabel = 'Primary navigation',
  className = '',
}: GlassNavigationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={`hidden lg:flex items-center gap-1 rounded-full bg-white/45 backdrop-blur-2xl border border-white/85 px-2 py-1 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(255,255,255,0.4),0_4px_14px_rgba(0,0,0,0.045)] ${className}`}
    >
      {children}
    </nav>
  );
}

interface GlassButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'glass' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  className?: string;
}

export function GlassButton({
  children,
  variant = 'glass',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  target,
  rel,
  ariaLabel,
  className = '',
}: GlassButtonProps) {
  const sizeCls =
    size === 'sm'
      ? 'px-3.5 py-2 text-xs'
      : size === 'lg'
        ? 'px-6 py-3.5 text-sm sm:text-[15px]'
        : 'px-5 py-2.5 text-xs sm:text-sm';

  const variantCls =
    variant === 'primary'
      ? 'liquid-glass-pill-dark text-white'
      : variant === 'subtle'
        ? 'frosted-glass-pill hover:bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
        : 'liquid-glass-cta hover:bg-white/85 text-[#1D1D1F]';

  const baseCls = `group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-55 disabled:pointer-events-none whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F] focus-visible:ring-offset-2 ${sizeCls} ${variantCls} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel}
        className={baseCls}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={baseCls}
    >
      {children}
    </button>
  );
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  tilt?: boolean;
}

export function GlassCard({
  children,
  className = '',
  interactive = true,
  tilt = true,
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(Number((-y * 6).toFixed(2)));
    setRotateY(Number((x * 6).toFixed(2)));
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={
        shouldReduceMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              y: rotateX !== 0 || rotateY !== 0 ? -4 : 0,
            }
      }
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 24,
      }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`liquid-glass-card rounded-3xl transition-shadow duration-300 ${
        interactive ? 'hover:border-white hover:shadow-[0_28px_64px_rgba(0,0,0,0.095)]' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  solid?: boolean;
}

export function GlassPanel({ children, className = '', solid = false }: GlassPanelProps) {
  return (
    <div
      className={`${
        solid
          ? 'bg-[#FFFFFF] border border-[#E8E8ED] shadow-[0_10px_32px_rgba(0,0,0,0.045)]'
          : 'liquid-glass-panel'
      } rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
}

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxWidthClass?: string;
}

export function GlassModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-2xl',
}: GlassModalProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#1D1D1F]/28 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`liquid-glass-modal rounded-3xl ${maxWidthClass} w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8`}
          >
            {(title || subtitle) && (
              <div className="flex items-start justify-between gap-4 border-b border-[#1D1D1F]/10 pb-4 mb-5">
                <div>
                  {subtitle && (
                    <p className="font-mono-num text-xs font-semibold text-[#6E6E73] mb-1">
                      {subtitle}
                    </p>
                  )}
                  {title && (
                    <h3 className="font-display text-xl font-bold text-[#1D1D1F]">
                      {title}
                    </h3>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="w-8 h-8 rounded-full bg-white/85 hover:bg-[#E8E8ED] border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface GlassDropdownProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

export function GlassDropdown({ open, children, className = '' }: GlassDropdownProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="menu"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute left-0 top-full pt-3 z-50 ${className}`}
        >
          <div className="liquid-glass-dropdown rounded-2xl p-2 text-[#1D1D1F]">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface GlassImageFrameProps {
  children: ReactNode;
  className?: string;
  caption?: string;
}

export function GlassImageFrame({
  children,
  className = '',
  caption,
}: GlassImageFrameProps) {
  return (
    <figure className={`liquid-glass-frame rounded-[30px] p-2.5 sm:p-3 ${className}`}>
      <div className="overflow-hidden rounded-[22px] bg-[#FFFFFF]">{children}</div>
      {caption && (
        <figcaption className="px-3 pt-2.5 pb-1 text-xs font-medium text-[#6E6E73]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface FloatingGlassCTAProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function FloatingGlassCTA({
  children,
  className = '',
  onClick,
  href,
}: FloatingGlassCTAProps) {
  const baseCls = `liquid-glass-cta inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold text-[#1D1D1F] hover:bg-white/95 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F] ${className}`;

  if (href) {
    return (
      <a href={href} className={baseCls}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseCls}>
      {children}
    </button>
  );
}
