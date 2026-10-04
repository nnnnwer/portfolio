const PREFIX = '[Placeholder]';

/** True when a value is missing or is seeded placeholder text. */
export const isPlaceholderText = (value) =>
  typeof value === 'string' && value.trim().startsWith(PREFIX);

/** Removes the "[Placeholder]" marker so the hint reads naturally. */
export const stripPlaceholder = (value) =>
  isPlaceholderText(value) ? value.trim().slice(PREFIX.length).trim() : value;

export const hasRealValue = (value) =>
  typeof value === 'string' ? value.trim() !== '' && !isPlaceholderText(value) : value != null;
