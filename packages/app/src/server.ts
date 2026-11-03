import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { provideRouteComponents } from '@globalise/router';
import { routeComponents } from './routeComponents.ts';

provideRouteComponents(routeComponents);

export default { fetch: createStartHandler(defaultStreamHandler) };
