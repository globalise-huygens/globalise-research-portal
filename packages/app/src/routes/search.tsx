import { createFileRoute } from '@tanstack/react-router';
import { validateSearchSearch } from '@globalise/search/url';
import { SearchPage } from '../SearchPage';

export const Route = createFileRoute('/search')({
  validateSearch: validateSearchSearch,
  component: SearchPage,
  // Existing widgets read browser state during render. Content pages keep SSR.
  ssr: false,
});
