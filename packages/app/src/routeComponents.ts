import { lazyRouteComponent, type RouteComponents } from '@globalise/router';
import { RootLayout } from './RootLayout.tsx';

export const routeComponents: RouteComponents = {
  __root__: RootLayout,
  '/': lazyRouteComponent(() => import('./Home.tsx'), 'Home'),
  '/map': lazyRouteComponent(() => import('@globalise/map'), 'MapDemo'),
  '/search': lazyRouteComponent(() => import('./SearchPage.tsx'), 'SearchPage'),
  '/catalog/': lazyRouteComponent(() => import('./CatalogPage.tsx'), 'CatalogPage'),
  '/hdl:20.500.14722/$': lazyRouteComponent(() => import('./ManifestPage.tsx'), 'ManifestPage'),
  '/object-card/': lazyRouteComponent(() => import('./ObjectCardPage.tsx'), 'ObjectCardPage'),
};
