import { ClientOnly, createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

const ManifestPage = lazyRouteComponent(() => import('../../ManifestPage.tsx'), 'ManifestPage');

export const Route = createFileRoute('/manifest/')({
  component: () => (
    <ClientOnly fallback={<p>Loading manifest viewer…</p>}>
      <ManifestPage />
    </ClientOnly>
  ),
});
