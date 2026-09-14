import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from 'srvx/node';
import { serveStatic } from 'srvx/static';
import handler from './dist/server/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const host = process.env.HOST || '0.0.0.0';

const server = serve({
  port,
  hostname: host,
  fetch: handler.fetch,
  middleware: [
    serveStatic({ dir: path.resolve(__dirname, './dist/client') }),
  ],
});

await server.ready();
console.log(`Server listening on http://${host}:${port}`);
