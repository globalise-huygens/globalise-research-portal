import { createFileRoute } from '@tanstack/react-router';
import { ManifestDocumentPageLayout } from '@globalise/manifest/layout';

export const Route = createFileRoute('/manifest/layout')({
  component: () => <ManifestDocumentPageLayout />,
});