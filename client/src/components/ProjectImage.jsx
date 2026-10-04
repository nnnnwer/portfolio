import { useEffect, useState } from 'react';
import { isPlaceholderText, stripPlaceholder } from '../utils/placeholder';

const initialsOf = (title) =>
  (stripPlaceholder(title) || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

/** Project image, or a generated board-style cover when there is none. */
export default function ProjectImage({ src, title, className = '', priority = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`Screenshot of ${stripPlaceholder(title)}`}
        onError={() => setFailed(true)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const initials = isPlaceholderText(title) ? '··' : initialsOf(title);

  return (
    <div className={`relative h-full w-full bg-board ${className}`} aria-hidden="true">
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="#c98a45" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
          <path d="M0 60 H90 L110 80 H130" />
          <path d="M0 140 H70 L90 120 H130" />
          <path d="M190 80 H230 L250 60 H320" />
          <path d="M190 120 H240 L260 140 H320" />
          <path d="M160 0 V60" />
          <path d="M160 140 V200" />
        </g>
        <g fill="#c98a45">
          <circle cx="130" cy="80" r="4" />
          <circle cx="130" cy="120" r="4" />
          <circle cx="190" cy="80" r="4" />
          <circle cx="190" cy="120" r="4" />
        </g>
        <rect x="130" y="60" width="60" height="80" rx="5" fill="#0f1a16" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-xl text-[#e8eee6]">
        {initials}
      </span>
    </div>
  );
}
