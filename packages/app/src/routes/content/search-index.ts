import { createFileRoute } from '@tanstack/react-router';
import { readContentFile } from '../../content.server.ts';

export const Route = createFileRoute('/content/search-index')({
  server: {
    handlers: {
      GET: serveSearchIndex,
    },
  },
});

async function serveSearchIndex(): Promise<Response> {
  try {
    const searchIndex = await readContentFile('search-index.json');
    return new Response(searchIndex, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error) {
    console.error('Globalise content search index unavailable:', error);
    return new Response(null, { status: 404 });
  }
}
