import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start/client';
import { provideRouteComponents } from '@globalise/router';
import { routeComponents } from './routeComponents.ts';
import { landingPageContent } from './landingPageContent.ts';

provideRouteComponents(routeComponents, landingPageContent.metadata);

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient/>
    </StrictMode>,
  );
});
