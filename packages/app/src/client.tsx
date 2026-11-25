import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start/client';
import { provideFallbackComponents, provideRouteComponents, provideRouteLoaders } from '@globalise/router';
import { NotFoundPage, RouteErrorPage } from './FallbackPage.tsx';
import { routeComponents } from './routeComponents.ts';
import { routeLoaders } from './routeLoaders.ts';
import { landingPageContent } from './landingPageContent.ts';

provideRouteComponents(routeComponents, landingPageContent.metadata);
provideRouteLoaders(routeLoaders);
provideFallbackComponents({ notFound: NotFoundPage, error: RouteErrorPage });

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient/>
    </StrictMode>,
  );
});
