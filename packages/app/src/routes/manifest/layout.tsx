import { createFileRoute } from '@tanstack/react-router';
import { ManifestLayoutIntegrationPage } from '../../ManifestLayoutIntegrationPage.tsx';

export const Route = createFileRoute('/manifest/layout')({
  component: ManifestLayoutIntegrationPage,
});
