import { notFound } from '@tanstack/react-router';
import type { RouteLoaders } from '@globalise/router';

export const routeLoaders: RouteLoaders = {
  '/content/$slug': () => {
    throw notFound();
  },
};
