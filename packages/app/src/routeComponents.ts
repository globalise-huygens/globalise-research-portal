import { lazyRouteComponent, type RouteComponents } from '@globalise/router';
import { handle } from '@globalise/common/uri';
import { RootLayout } from './RootLayout.tsx';

export const routeComponents: RouteComponents = {
  __root__: RootLayout,
  '/': lazyRouteComponent(() => import('./Home.tsx'), 'Home'),
  '/map': lazyRouteComponent(() => import('@globalise/map'), 'MapDemo'),
  '/search': lazyRouteComponent(() => import('./SearchPage.tsx'), 'SearchPage'),
  '/catalog/': lazyRouteComponent(() => import('./CatalogPage.tsx'), 'CatalogPage'),
  [`/${handle}/inventory:{$}` as const]: lazyRouteComponent(() => import('./ManifestPage.tsx'), 'ManifestPage'),
  [`/${handle}/$` as const]: lazyRouteComponent(() => import('./ObjectCardPage.tsx'), 'HandleObjectCardPage'),
  '/object-card/': lazyRouteComponent(() => import('./ObjectCardPage.tsx'), 'ObjectCardPage'),
  '/content/blog': lazyRouteComponent(() => import('./BlogIndex.tsx'), 'BlogIndex'),
  '/content/': lazyRouteComponent(() => import('./ContentHome.tsx'), 'ContentHome'),
  '/content/$slug': lazyRouteComponent(() => import('./ContentPage.tsx'), 'ContentPage'),
};
