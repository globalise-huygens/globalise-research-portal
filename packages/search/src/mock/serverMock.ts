import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import archive from './archive.json';

export default setupWorker(
  http.post<object, { offset: number, limit: number }>('https://globalise-panoptes/api/datasets/globalise/search', async ({ request }) => searchResolver(await request.json())),
  http.post('https://globalise-panoptes/api/datasets/globalise/facet/archive', () => HttpResponse.json(archive)),
);

function searchResolver({ offset, limit }: { offset: number; limit: number }) {
  return HttpResponse.json({
    amount: 50, items: [...Array(limit).keys()].map((i) => {
      const id = offset + i + 1;
      return { id, title: `Item ${id}` };
    }),
  });
}
