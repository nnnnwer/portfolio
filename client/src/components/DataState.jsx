import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';

/**
 * Renders loading, error and empty states for a useApi() result,
 * and calls children(data) once there is something to show.
 */
export default function DataState({
  state,
  label = 'content',
  isEmpty = (data) => Array.isArray(data) && data.length === 0,
  emptyTitle = 'Nothing here yet',
  emptyMessage,
  children,
}) {
  const { data, error, loading, slow, retry } = state;

  if (loading && data === undefined) return <LoadingState label={`Loading ${label}`} slow={slow} />;
  if (error) return <ErrorState title={`Couldn't load ${label}`} error={error} onRetry={retry} />;
  if (data === undefined || isEmpty(data)) return <EmptyState title={emptyTitle} message={emptyMessage} />;

  return children(data);
}
