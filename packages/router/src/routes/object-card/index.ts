import { createFileRoute } from '@tanstack/react-router';
import { validateObjectCardUrlParams } from '../../params/objectCardUrlParams.ts';

export const Route = createFileRoute('/object-card/')({
  validateSearch: validateObjectCardUrlParams,
});
