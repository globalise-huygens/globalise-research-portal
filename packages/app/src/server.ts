import handler, { createServerEntry } from '@tanstack/react-start/server-entry';
import { getContentAsset } from '@globalise/content/serve';
import { provideRouterSetup } from '@globalise/router';
import { routerSetup } from './routerSetup.ts';

provideRouterSetup(routerSetup);

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
