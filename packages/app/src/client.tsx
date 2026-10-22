import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start/client';
import { provideRouteComponents } from '@globalise/router';
import { routeComponents } from './routeComponents.ts';

provideRouteComponents(routeComponents);

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient/>
    </StrictMode>,
  );
});
