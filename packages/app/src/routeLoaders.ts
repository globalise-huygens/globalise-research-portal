import { getContentIndexServer, getContentPageServer } from '@globalise/content/serve';
import type { RouteLoaders } from '@globalise/router';

export const routeLoaders: RouteLoaders = {
  '/content/': () => getContentIndexServer(),
  '/content/$slug': ({ params }) => getContentPageServer({ data: params.slug }),
};
