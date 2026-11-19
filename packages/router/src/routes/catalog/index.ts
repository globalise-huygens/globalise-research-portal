import { createFileRoute } from '@tanstack/react-router';
import { validateCatalogUrlParams } from '../../params/catalogUrlParams.ts';

export const Route = createFileRoute('/catalog/')({
  validateSearch: validateCatalogUrlParams,
});
