import { createFileRoute } from '@tanstack/react-router';
import { validateSearchUrlParams } from '../params/searchUrlParams.ts';

export const Route = createFileRoute('/search')({
  validateSearch: validateSearchUrlParams,
});
