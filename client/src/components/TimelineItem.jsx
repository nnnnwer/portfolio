import { isPlaceholderText, stripPlaceholder } from '../utils/placeholder';
import PlaceholderBadge from './PlaceholderBadge';
import PlaceholderText from './PlaceholderText';

/** One entry in an education or experience timeline. */
export default function TimelineItem({ title, subtitle, period, meta, description, highlights = [], isPlaceholder, compact = false }) {
  return (
    <li className="print-avoid-break relative pb-8 pl-7 last:pb-0">
      {/* Trace and via: the vertical line with a node for each entry */}
      <span aria-hidden="true" className="absolute top-2 bottom-0 left-[5px] w-0.5 bg-line" />
      <span
        aria-hidden="true"
        className="absolute top-1.5 left-0 size-3 rounded-full border-2 border-copper bg-canvas"
      />

      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <h3 className={`${compact ? 'text-base' : 'text-lg'} leading-snug font-semibold`}>
          <PlaceholderText value={title} inline />
        </h3>
        {isPlaceholder && <PlaceholderBadge className="print:hidden" />}
      </div>

      {subtitle && (
        <p className="mt-0.5 font-medium text-ink/85">
          {isPlaceholderText(subtitle) ? (
            <span className="text-muted italic">{stripPlaceholder(subtitle)}</span>
          ) : (
            subtitle
          )}
        </p>
      )}

      {(period || meta) && (
        <p className="mt-0.5 text-sm text-muted">{[period, meta].filter(Boolean).join(', ')}</p>
      )}

      {description && (
        <div className={compact ? 'mt-2 text-[0.95rem]' : 'mt-3'}>
          <PlaceholderText value={description} />
        </div>
      )}

      {highlights.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 marker:text-copper">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
