import { useEffect, useState } from 'react';
import PhotoPlaceholder from './PhotoPlaceholder';

/**
 * Profile portrait with graceful fallbacks:
 * loading -> shimmer, missing or broken URL -> labelled placeholder.
 */
export default function ProfilePhoto({ src, name, loading = false, priority = false, className = '' }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (loading) {
    return <div className={`h-full w-full animate-pulse bg-[#2a4a3e] ${className}`} aria-hidden="true" />;
  }

  if (!src || failed) return <PhotoPlaceholder className={className} />;

  return (
    <img
      src={src}
      alt={`Portrait of ${name}`}
      onError={() => setFailed(true)}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
