import { lazyRouteComponent, type RouteComponents } from '@globalise/router';
import { RootLayout } from './RootLayout.tsx';

export const routeComponents: RouteComponents = {
  __root__: RootLayout,
  '/': lazyRouteComponent(() => import('./Home.tsx'), 'Home'),
  '/map': lazyRouteComponent(() => import('@globalise/map'), 'MapDemo'),
  '/search': lazyRouteComponent(() => import('@globalise/search'), 'Search'),
  '/catalog/': lazyRouteComponent(() => import('./CatalogPage.tsx'), 'CatalogPage'),
  '/manifest/': lazyRouteComponent(() => import('./ManifestPage.tsx'), 'ManifestPage'),
  '/object-card/': lazyRouteComponent(() => import('./ObjectCardPage.tsx'), 'ObjectCardPage'),
};
