import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { provideRouteComponents } from '@globalise/router';
import { routeComponents } from './routeComponents.ts';
import { landingPageContent } from './landingPageContent.ts';

provideRouteComponents(routeComponents, landingPageContent.metadata);

export default { fetch: createStartHandler(defaultStreamHandler) };
