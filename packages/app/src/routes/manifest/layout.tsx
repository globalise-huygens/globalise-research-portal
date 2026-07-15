import { createFileRoute } from '@tanstack/react-router';
import { ManifestLayoutPage } from '../../ManifestLayoutPage.tsx';

export const Route = createFileRoute('/manifest/layout')({
  component: ManifestLayoutPage,
});