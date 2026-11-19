import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start/client';
import { provideRouteComponents, provideRouteLoaders } from '@globalise/router';
import { routeComponents } from './routeComponents.ts';
import { routeLoaders } from './routeLoaders.ts';
import { landingPageContent } from './landingPageContent.ts';

provideRouteComponents(routeComponents, landingPageContent.metadata);
provideRouteLoaders(routeLoaders);

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient/>
    </StrictMode>,
  );
});
