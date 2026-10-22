import { createFileRoute } from '@tanstack/react-router';
import { CatalogPage } from '../../CatalogPage.tsx';
import { uriSearch } from '../../url/uriSearch.ts';

export const Route = createFileRoute('/catalog/')({
  component: CatalogPage,
  validateSearch: uriSearch,
});
