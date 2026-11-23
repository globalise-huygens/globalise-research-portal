import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import { checkFacets, GlobaliseSearchStateSchema } from './elastic.server';
import { indexKeys, indices } from '../indices';

export type Term = {
  start: number;
  end: number;
  count: number;
};

const RangeFacetItemsRequestSchema = GlobaliseSearchStateSchema.extend({
  index: z.enum(indexKeys),
  key: z.string(),
}).superRefine((data, ctx) => {
  checkFacets(data, ctx);
  if (!Object.hasOwn(indices[data.index].rangeFacets, data.key)) {
    ctx.addIssue({ code: 'custom', path: ['key'], message: `Unknown range facet '${data.key}' for index '${data.index}'` });
  }
});

const rangeFacetItems = createServerFn({ method: 'POST' })
  .validator(RangeFacetItemsRequestSchema)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .handler(({ data }) => {
    // TODO: Replace with ElasticSearch query and response
    const terms: Term[] = [
      { start: 1600, end: 1649, count: 200 },
      { start: 1650, end: 1699, count: 300 },
      { start: 1700, end: 1749, count: 900 },
      { start: 1750, end: 1799, count: 1000 },
      { start: 1800, end: 1849, count: 800 },
      { start: 1850, end: 1899, count: 500 },
    ];
    return terms;
  });

export default rangeFacetItems;
