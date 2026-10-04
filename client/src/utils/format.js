const monthYear = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });

export function formatYearRange(start, end, status) {
  if (!start && !end) return status === 'in_progress' ? 'In progress' : null;
  if (start && !end) return `${start} to ${status === 'in_progress' ? 'present' : '?'}`;
  if (!start) return String(end);
  return start === end ? String(start) : `${start} to ${end}`;
}

export function formatDateRange(start, end, isCurrent) {
  const fmt = (value) => {
    if (!value) return null;
    // Dates arrive as YYYY-MM-DD; parse as local to avoid timezone shifts.
    const [y, m] = value.split('-').map(Number);
    return monthYear.format(new Date(y, (m || 1) - 1, 1));
  };
  const from = fmt(start);
  const to = isCurrent ? 'present' : fmt(end);
  if (!from && !to) return null;
  if (!from) return to;
  return `${from} to ${to ?? '?'}`;
}

export const PROJECT_STATUS_LABELS = {
  completed: 'Completed',
  in_progress: 'In progress',
  planned: 'Planned',
};

/** Splits long text into paragraphs on blank lines. */
export const toParagraphs = (text) =>
  (text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
