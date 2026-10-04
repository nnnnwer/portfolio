export default function PlaceholderBadge({ className = '' }) {
  return (
    <span
      title="Placeholder content. Replace it in the Supabase dashboard."
      className={`inline-flex shrink-0 items-center rounded-full border border-dashed border-copper bg-copper-soft px-2 py-0.5 text-xs font-medium text-copper ${className}`}
    >
      Placeholder
    </span>
  );
}
