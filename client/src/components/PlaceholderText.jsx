import { isPlaceholderText, stripPlaceholder } from '../utils/placeholder';
import PlaceholderBadge from './PlaceholderBadge';

/**
 * Shows text normally, or as a clearly marked placeholder when the value is
 * missing or starts with "[Placeholder]".
 *  - `fallback`: hint shown when the value is empty
 *  - `inline`:   render as a <span> (for names inside rows, headings, etc.)
 */
export default function PlaceholderText({ value, fallback = 'Not added yet', inline = false, className = '' }) {
  const isMissing = value == null || String(value).trim() === '';
  const isPlaceholder = isMissing || isPlaceholderText(value);

  if (!isPlaceholder) {
    const Tag = inline ? 'span' : 'p';
    return <Tag className={className}>{value}</Tag>;
  }

  const text = isMissing ? fallback : stripPlaceholder(value);

  if (inline) {
    return (
      <span className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
        <span className="text-muted italic">{text}</span>
        <PlaceholderBadge />
      </span>
    );
  }

  return (
    <div className={`border-l-2 border-dashed border-copper pl-4 ${className}`}>
      <PlaceholderBadge className="mb-2" />
      <p className="text-muted italic">{text}</p>
    </div>
  );
}
