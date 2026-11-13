import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export function SafeImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3EAE6] via-[#FAF7F5] to-[#EBDAD4] p-6 text-center text-[#6B585E] ${className}`}
      >
        <Sparkles className="h-6 w-6 stroke-[1.25] text-[#A33D55]/60" />
        <span className="mt-2 font-display text-sm italic">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      width={width}
      height={height}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
