import { createFileRoute } from '@tanstack/react-router';
import { ManifestDocumentPage } from '../../ManifestDocumentPage.tsx';

export const Route = createFileRoute('/manifest/')({
  component: ManifestIndex,
});

function ManifestIndex() {
  return <ManifestDocumentPage />;
}