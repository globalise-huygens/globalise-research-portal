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

export function getRouter(): AppRouter {
  const router = createAppRouter();
  const components = routeComponents ?? orThrow('Provide the route components before creating the router');
  for (const id of Object.keys(components) as RouteId[]) {
    const route: AnyRoute = router.routesById[id];
    route.update({ component: components[id] });
  }
  return router;
}

export function provideRouteComponents(components: RouteComponents) {
  routeComponents = components;
}

let routeComponents: RouteComponents | undefined;

function createAppRouter() {
  return createRouter({
    routeTree,
    context: { queryClient: new QueryClient() } satisfies RouterContext,
    parseSearch: parseUrlParams,
    stringifySearch: stringifyUrlParams,
  });
}

declare module '@tanstack/react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: AppRouter;
  }
}
