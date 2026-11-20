import { useLocation } from '@tanstack/react-router';
import { getRouteApi, toHref } from '@globalise/router';
import { Search } from '@globalise/search';
import { Link } from 'react-aria-components';
import './SearchPage.css';

const route = getRouteApi('/search');

export function SearchPage() {
  const focusSearch = useLocation({
    select: (location) => location.hash === 'archive-search',
  });
  const { q } = route.useSearch();

  return (
    <Search
      autoFocus={focusSearch}
      searchHeaderLink={
        <Link
          className="content-search-link"
          href={toHref({ to: '/content', search: { q } })}
        >
          Search site content
        </Link>
      }
    />
  );
}
