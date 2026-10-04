import { isPlaceholderText, stripPlaceholder } from '../utils/placeholder';

export default function TechChip({ name }) {
  const placeholder = isPlaceholderText(name);
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[0.78rem] ${
        placeholder
          ? 'border border-dashed border-copper text-copper italic'
          : 'border border-line bg-canvas text-ink'
      }`}
    >
      {placeholder ? stripPlaceholder(name) : name}
    </span>
  );
}
