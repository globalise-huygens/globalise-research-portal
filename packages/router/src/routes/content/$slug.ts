import { createFileRoute } from '@tanstack/react-router';
import { validateContentUrlParams } from '../../params/contentUrlParams.ts';

export const Route = createFileRoute('/content/$slug')({
  validateSearch: validateContentUrlParams,
});
