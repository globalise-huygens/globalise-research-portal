import { getContentPageServer } from '@globalise/content/serve';
import type { RouteLoaders } from '@globalise/router';

export const routeLoaders: RouteLoaders = {
  '/content/$slug': ({ params }) => getContentPageServer({ data: params.slug }),
};
