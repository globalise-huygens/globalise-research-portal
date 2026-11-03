import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { provideRouteComponents, provideRouteLoaders } from '@globalise/router';
import { routeComponents } from './routeComponents.ts';
import { routeLoaders } from './routeLoaders.ts';
import { landingPageContent } from './landingPageContent.ts';

provideRouteComponents(routeComponents, landingPageContent.metadata);
provideRouteLoaders(routeLoaders);

export default { fetch: createStartHandler(defaultStreamHandler) };
