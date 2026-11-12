import { createFileRoute, redirect } from '@tanstack/react-router';
import { validateManifestUrlParams } from '../../params/manifestUrlParams.ts';
import { findViewerPath } from '../../viewer/viewerHref.ts';
import { stringifyUrlParams } from '../../params/urlParams.ts';

// TODO: remove once internal links do not use /manifest anymore
export const Route = createFileRoute('/manifest/')({
  validateSearch: validateManifestUrlParams,
  beforeLoad: ({ search }) => {
    redirect({ href: findViewerPath(search) + stringifyUrlParams(search), throw: true });
  },
});
