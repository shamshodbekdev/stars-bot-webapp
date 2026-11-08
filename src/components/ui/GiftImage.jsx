import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { Skeleton } from './Skeleton';
import { cn } from '../../utils/cn';

/**
 * Lazy-loaded gift image. Shows a skeleton until the image is decoded and a
 * neutral icon if it fails to load.
 */
export default function GiftImage({ src, alt, className, eager = false }) {
  const [status, setStatus] = useState('loading'); // loading | loaded | error

  return (
    <div className={cn('relative aspect-square overflow-hidden', className)}>
      {status === 'loading' && <Skeleton className="absolute inset-0 rounded-xl" />}

      {status === 'error' ? (
        <div className="absolute inset-0 grid place-items-center text-muted/50">
          <ImageOff size={28} strokeWidth={1.5} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          // Catches images that finish loading before React attaches onLoad
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0 && status === 'loading') setStatus('loaded');
          }}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-contain transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  );
}
