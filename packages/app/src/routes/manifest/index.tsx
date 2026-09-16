import { createFileRoute } from '@tanstack/react-router';
import { ManifestPage } from '../../ManifestPage.tsx';

export const Route = createFileRoute('/manifest/')({
  component: ManifestPage,
});