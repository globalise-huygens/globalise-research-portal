import { createFileRoute } from '@tanstack/react-router';
import { ObjectCardPage } from '../../ObjectCardPage.tsx';
import { uriSearch } from '../../uriSearch.ts';

export const Route = createFileRoute('/object-card/')({
  component: ObjectCardPage,
  validateSearch: uriSearch,
});