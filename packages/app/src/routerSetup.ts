import type { RouterSetup } from '@globalise/router';
import { NotFoundPage, RouteErrorPage } from './FallbackPage.tsx';
import { landingPageContent } from './landingPageContent.ts';
import { routeComponents } from './routeComponents.ts';
import { routeLoaders } from './routeLoaders.ts';

export const routerSetup: RouterSetup = {
  components: routeComponents,
  loaders: routeLoaders,
  fallbacks: { notFound: NotFoundPage, error: RouteErrorPage },
  homeMetadata: landingPageContent.metadata,
};
