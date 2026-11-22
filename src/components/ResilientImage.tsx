import { ImgHTMLAttributes, useState } from 'react';

interface ResilientImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  imageClassName?: string;
  branded?: boolean;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
  imageClassName = '',
  branded: _branded,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col items-center justify-center bg-[#FFFFFF] border border-[#E8E8ED] p-6 text-center text-[#1D1D1F] ${className}`}
      >
        <p className="text-[11px] font-semibold tracking-wide text-[#6E6E73]">
          AKYIN Ventures
        </p>
        <p className="mt-1.5 font-display text-base font-bold tracking-tight text-[#1D1D1F] max-w-xs">
          {fallbackTitle || alt}
        </p>
      </div>
    );
  }

  const hasFitUtility = /\bobject-(contain|cover|fill|none|scale-down)\b/.test(imageClassName);

  return (
    <div className={`relative overflow-hidden bg-[#FFFFFF] ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onError={() => setHasError(true)}
        className={`w-full h-full ${hasFitUtility ? '' : 'object-cover'} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${imageClassName}`}
        {...rest}
      />
    </div>
  );
}
