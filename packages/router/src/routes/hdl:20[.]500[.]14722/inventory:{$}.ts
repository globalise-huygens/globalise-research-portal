import { createFileRoute } from '@tanstack/react-router';
import { createViewerSplat, parseViewerSplat } from '@globalise/common/uri';
import { validateManifestUrlParams } from '../../params/manifestUrlParams.ts';

/**
 * TODO Enable ssr for manifest viewer: only osd needs the browser
 * - split @knaw-huc/osd-iiif-viewer into iiif and osd barrel
 * - metadata, toc and stores should only use the iiif barrel
 * - import openseadragon lazily
 * - use type only imports for osd types
 */
export const Route = createFileRoute('/hdl:20.500.14722/inventory:{$}')({
  params: {

    /**
     * Splat is a 'catch-all route' matching everything after `/hdl:20.500.14722/inventory:` using the `$` wildcard.
     * This allows the app to parse the url once, creating a clean, browsable navigation history.
     * See: https://tanstack.com/router/latest/docs/routing/routing-concepts#splat-catch-all-routes
     */
    parse: ({ _splat }) => ({ viewer: parseViewerSplat(_splat ?? '') }),
    stringify: ({ viewer }) => ({ _splat: viewer ? createViewerSplat(viewer) : '' }),
  },
  validateSearch: validateManifestUrlParams,
  ssr: false,
});
