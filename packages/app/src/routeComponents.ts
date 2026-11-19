import { lazyRouteComponent, type RouteComponents } from '@globalise/router';
import { handle } from '@globalise/common/uri';
import { RootLayout } from './RootLayout.tsx';

export const routeComponents: RouteComponents = {
  __root__: RootLayout,
  '/': lazyRouteComponent(() => import('./Home.tsx'), 'Home'),
  '/map': lazyRouteComponent(() => import('@globalise/map'), 'MapDemo'),
  '/search': lazyRouteComponent(() => import('./SearchPage.tsx'), 'SearchPage'),
  '/catalog/': lazyRouteComponent(() => import('./CatalogPage.tsx'), 'CatalogPage'),
  [`/${handle}/$` as const]: lazyRouteComponent(() => import('./ManifestPage.tsx'), 'ManifestPage'),
  '/object-card/': lazyRouteComponent(() => import('./ObjectCardPage.tsx'), 'ObjectCardPage'),
  '/content/': lazyRouteComponent(() => import('./ContentHome.tsx'), 'ContentHome'),
  '/content/$slug': lazyRouteComponent(() => import('./ContentPage.tsx'), 'ContentPage'),
};
