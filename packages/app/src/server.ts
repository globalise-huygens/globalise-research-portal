import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { getContentAsset } from '@globalise/content/serve';
import { provideRouteComponents, provideRouteLoaders } from '@globalise/router';
import { routeComponents } from './routeComponents.ts';
import { routeLoaders } from './routeLoaders.ts';
import { landingPageContent } from './landingPageContent.ts';

provideRouteComponents(routeComponents, landingPageContent.metadata);
provideRouteLoaders(routeLoaders);

const startHandler = createStartHandler(defaultStreamHandler);

export default { fetch: handleRequest };

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);
  const response = await getContentAsset(pathname) ?? await startHandler(request);
  if (response.status === 404) {
    console.error(`404: could not find ${pathname}`);
  }
  return response;
}
