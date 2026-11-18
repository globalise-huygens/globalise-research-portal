import handler, { createServerEntry } from '@tanstack/react-start/server-entry';
import { getContentAsset } from '@globalise/content/serve';
import { provideRouteComponents, provideRouteLoaders } from '@globalise/router';
import { routeComponents } from './routeComponents.ts';
import { routeLoaders } from './routeLoaders.ts';
import { landingPageContent } from './landingPageContent.ts';

provideRouteComponents(routeComponents, landingPageContent.metadata);
provideRouteLoaders(routeLoaders);

/**
 * Serve content assets, or use default router
 */
export default createServerEntry({
  async fetch(request, opts) {
    const { pathname } = new URL(request.url);

    const asset = await getContentAsset(pathname);
    if (asset) {
      return asset;
    }

    return handler.fetch(request, opts);
  },
});
