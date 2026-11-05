import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { provideRouteComponents, provideRouteLoaders } from '@globalise/router';
import { routeComponents } from './routeComponents.ts';
import { routeLoaders } from './routeLoaders.ts';
import { landingPageContent } from './landingPageContent.ts';

provideRouteComponents(routeComponents, landingPageContent.metadata);
provideRouteLoaders(routeLoaders);

const startHandler = createStartHandler(defaultStreamHandler);

export default { fetch: handleRequest };

async function handleRequest(request: Request): Promise<Response> {
  const response = await startHandler(request);
  if (response.status === 404) {
    const { pathname } = new URL(request.url);
    console.error(`404: could not find ${pathname}`);
  }
  return response;
}
