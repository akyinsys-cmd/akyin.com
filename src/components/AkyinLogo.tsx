import { motion, useReducedMotion } from 'motion/react';

interface AkyinLogoProps {
  wordmark?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showSubtext?: boolean;
  className?: string;
}

const CLEAN_LOGO_SRC = '/assets/aistudio/akyin_logo_clean.png';
const MONOGRAM_SRC = '/assets/aistudio/akyin_monogram_clean.png';

export function AkyinLogo({
  wordmark = 'AKYIN',
  size = 'md',
  animated = false,
  showSubtext = false,
  className = '',
}: AkyinLogoProps) {
  const shouldReduceMotion = useReducedMotion();
  const isCustomWordmark = wordmark.trim().toUpperCase() !== 'AKYIN';

  const logoHeightClass =
    size === 'sm'
      ? 'h-6 sm:h-7.5'
      : size === 'lg'
        ? 'h-11 sm:h-14'
        : 'h-8 sm:h-9';

  const logoMaxWidthClass =
    size === 'sm'
      ? 'max-w-[170px] sm:max-w-[190px]'
      : size === 'lg'
        ? 'max-w-[260px] sm:max-w-[320px]'
        : 'max-w-[210px] sm:max-w-[240px]';

  const monogramHeightClass =
    size === 'sm'
      ? 'h-6 w-auto'
      : size === 'lg'
        ? 'h-10 w-auto'
        : 'h-7 w-auto';

  const customTextClass =
    size === 'sm'
      ? 'text-[15px]'
      : size === 'lg'
        ? 'text-xl sm:text-2xl'
        : 'text-[17px]';

  // Custom wordmark view: Monogram ribbon icon on frosted glass pill + text
  if (isCustomWordmark) {
    const customContent = (
      <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
        <span className="relative inline-flex items-center justify-center p-1 rounded-xl frosted-glass-pill shrink-0">
          <img
            src={MONOGRAM_SRC}
            alt="AKYIN"
            className={`${monogramHeightClass} object-contain transition-transform duration-200 group-hover:scale-105`}
            draggable={false}
          />
        </span>
        <span className="flex flex-col leading-none">
          <span
            className={`font-display font-bold tracking-[-0.02em] text-[#1D1D1F] ${customTextClass}`}
          >
            {wordmark}
          </span>
          {showSubtext && (
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#6E6E73] mt-0.5">
              Ventures
            </span>
          )}
        </span>
      </span>
    );

    if (animated && !shouldReduceMotion) {
      return (
        <motion.span
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex"
        >
          {customContent}
        </motion.span>
      );
    }
    return customContent;
  }

  // Standard brand lockup: Zero black background, pure transparent metallic/titanium 3D ribbon & typography
  // surrounded by delicate frosted glass hover response
  const logoContent = (
    <span
      className={`group relative inline-flex items-center py-0.5 px-1 rounded-xl transition-all duration-200 hover:bg-white/40 ${className}`}
    >
      <img
        src={CLEAN_LOGO_SRC}
        alt="AKYIN Ventures"
        className={`${logoHeightClass} ${logoMaxWidthClass} w-auto object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-transform duration-200 group-hover:scale-[1.02]`}
        draggable={false}
      />
    </span>
  );

  if (animated && !shouldReduceMotion) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex"
      >
        {logoContent}
      </motion.span>
    );
  }

  return logoContent;
}
