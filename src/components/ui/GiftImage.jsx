import { memo, useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Lazy-loaded gift image. Shows a static placeholder until the image is
 * loaded and a neutral icon if it fails to load.
 *
 * Kept deliberately cheap: memoized, no per-render ref callbacks and no
 * infinite shimmer animation (images are ~10 KB and load almost instantly).
 */
function GiftImage({ src, alt, className, eager = false }) {
  const imgRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | loaded | error

  // Reset when the source changes; catch images already in the browser cache
  // that finished loading before React attached onLoad.
  useEffect(() => {
    const img = imgRef.current;
    setStatus(img?.complete && img.naturalWidth > 0 ? 'loaded' : 'loading');
  }, [src]);

  return (
    <div className={cn('relative aspect-square overflow-hidden', className)}>
      {status === 'loading' && <div className="absolute inset-0 rounded-xl bg-fg/[0.06]" aria-hidden="true" />}

      {status === 'error' ? (
        <div className="absolute inset-0 grid place-items-center text-muted/50">
          <ImageOff size={28} strokeWidth={1.5} />
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={200}
          height={200}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'relative h-full w-full select-none object-contain transition-opacity duration-200',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  );
}

export default memo(GiftImage);
