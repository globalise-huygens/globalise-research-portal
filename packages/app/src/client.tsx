import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start/client';
import { provideRouterSetup } from '@globalise/router';
import { routerSetup } from './routerSetup.ts';

provideRouterSetup(routerSetup);

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient/>
    </StrictMode>,
  );
});
