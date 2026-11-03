import { createRootRouteWithContext } from '@tanstack/react-router';
import type { RouterContext } from '../router.ts';
import { RootDocument } from '../RootDocument.tsx';

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'Globalise' },
    ],
    links: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  }),
  shellComponent: RootDocument,
});
