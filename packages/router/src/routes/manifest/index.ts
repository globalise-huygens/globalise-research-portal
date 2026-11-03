import { createFileRoute } from '@tanstack/react-router';
import { resetUrlParamsOnManifestChange, validateManifestUrlParams } from '../../params/manifestUrlParams.ts';

/**
 * TODO Enable ssr for manifest viewer: only osd needs the browser
 * - split @knaw-huc/osd-iiif-viewer into iiif and osd barrel
 * - metadata, toc and stores should only use the iiif barrel
 * - import openseadragon lazily
 * - use type only imports for osd types
 */
export const Route = createFileRoute('/manifest/')({
  validateSearch: validateManifestUrlParams,
  search: {
    middlewares: [resetUrlParamsOnManifestChange],
  },
  ssr: false,
});
