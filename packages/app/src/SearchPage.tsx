import { useLocation } from '@tanstack/react-router';
import { Search } from '@globalise/search';

export function SearchPage() {
  const focusSearch = useLocation({ select: (location) => location.hash === 'archive-search' });
  return <Search autoFocus={focusSearch} />;
}
