import { type AnyRoute, createRouter, type RouteComponent, type RouteIds } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { orThrow } from '@globalise/common';
import { parseUrlParams, stringifyUrlParams } from './params/urlParams.ts';
import { routeTree } from './routeTree.gen.ts';

export type RouterContext = {
  queryClient: QueryClient;
};

export type AppRouter = ReturnType<typeof createAppRouter>;

export type RouteId = RouteIds<AppRouter['routeTree']>;

export type RouteComponents = Record<RouteId, RouteComponent>;

export type RouteLoaders = Partial<Record<RouteId, RouteLoader>>;

type RouteLoader = (match: { params: Record<string, string> }) => Promise<unknown>;

export type RouterSetup = {
  components: RouteComponents;
  loaders: RouteLoaders;
  fallbacks: FallbackComponents;
  homeMetadata?: { title: string; description: string };
};

type FallbackComponents = {
  notFound: RouteComponent;
  error: RouteComponent;
};

export function getRouter(): AppRouter {
  const { components, loaders, fallbacks, homeMetadata } = routerSetup
    ?? orThrow('Provide the router setup before creating the router');
  const router = createAppRouter(fallbacks);
  for (const id of Object.keys(components) as RouteId[]) {
    const route: AnyRoute = router.routesById[id];
    route.options.loader = loaders[id];
    route.update({
      component: components[id],
      ...(id === '/' && homeMetadata ? { head: () => ({ meta: [
        { title: homeMetadata.title },
        { name: 'description', content: homeMetadata.description },
      ] }) } : {}),
    });
  }
  return router;
}

export function provideRouterSetup(setup: RouterSetup) {
  routerSetup = setup;
}

let routerSetup: RouterSetup | undefined;

function createAppRouter(fallbacks: FallbackComponents) {
  return createRouter({
    routeTree,
    context: { queryClient: new QueryClient() } satisfies RouterContext,
    pathParamsAllowedCharacters: [':'],
    parseSearch: parseUrlParams,
    stringifySearch: stringifyUrlParams,
    scrollToTopSelectors: [
      '.site-content:has(> :is(.blog-index, .blog-post, .content-page, .content-home))',
    ],
    defaultNotFoundComponent: fallbacks.notFound,
    defaultErrorComponent: fallbacks.error,
  });
}

declare module '@tanstack/react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: AppRouter;
  }
}
