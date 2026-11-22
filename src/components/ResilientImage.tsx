import { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  loading?: 'eager' | 'lazy';
  fallbackTitle?: string;
  branded?: boolean;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  loading = 'lazy',
  fallbackTitle,
  branded = true,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EFE9DE] via-[#F7F5F0] to-[#D9CCB9] text-[#292722] p-6 ${className}`}
      >
        <Layers className="w-7 h-7 text-[#B66A50] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-center text-[#77736C]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#EFE9DE] ${className}`}>
      {/* Blur-up placeholder skeleton layer until loaded */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#EFE9DE] via-[#F7F5F0] to-[#EFE9DE] animate-pulse"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-[opacity,transform,filter] duration-500 ease-out ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm scale-[1.02]'
        } ${imageClassName}`}
      />
      {branded && isLoaded && (
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[#292722]/50 backdrop-blur-[4px] border border-white/20 text-[#F7F5F0]/90 font-display text-[9px] sm:text-[10px] font-bold tracking-[0.16em]"
        >
          AKYIN
        </div>
      )}
    </div>
  );
}
