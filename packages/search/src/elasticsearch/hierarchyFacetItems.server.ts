import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import { AggregationsStringTermsAggregate, AggregationsStringTermsBucket } from '@elastic/elasticsearch/lib/api/types';
import elastic from './client.server';
import { getLabel } from './labels.server';
import { checkFacets, getSearchQuery, GlobaliseSearchStateSchema } from './elastic.server';
import { indexKeys, indices } from '../indices';

type HierarchyFacetItemsRequest = z.infer<typeof HierarchyFacetItemsRequestSchema>;

export type HierarchyFacetItem = {
  id: string;
  label: string;
  count: number;
  children?: HierarchyFacetItem[];
};

const HierarchyFacetItemsRequestSchema = GlobaliseSearchStateSchema.extend({
  index: z.enum(indexKeys),
  key: z.string(),
}).superRefine((data, ctx) => {
  checkFacets(data, ctx);
  if (!Object.hasOwn(indices[data.index].hierarchyFacets, data.key)) {
    ctx.addIssue({ code: 'custom', path: ['key'], message: `Unknown hierarchy facet '${data.key}' for index '${data.index}'` });
  }
});

const separator = '|';
const cache = new Map<string, Promise<HierarchyFacetItem[]>>();

const hierarchyFacetItems = createServerFn({ method: 'POST' })
  .validator(HierarchyFacetItemsRequestSchema)
  .handler(async ({ data }) => {
    const cacheKey = `${data.index}:${data.key}`;
    if (!data.query && (!data.facets || Object.keys(data.facets).length === 0)) {
      if (!cache.has(cacheKey)) {
        cache.set(cacheKey, getHierarchyFacetItems(data));
      }
      return cache.get(cacheKey)!;
    }
    return getHierarchyFacetItems(data);
  });

function countMissing(items: HierarchyFacetItem[]) {
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      countMissing(item.children);
      if (item.count === 0) {
        item.count = item.children.reduce((sum, child) => sum + child.count, 0);
      }
    }
  }
}

async function getHierarchyFacetItems(data: HierarchyFacetItemsRequest) {
  const index = indices[data.index];
  const result = await elastic.search({
    index: index.esIndex,
    size: 0,
    aggs: {
      items: {
        terms: {
          field: index.hierarchyFacets[data.key].tree,
          size: 10000,
          order: {
            _count: 'desc',
          },
        },
      },
    },
    query: getSearchQuery(index, data.query, data.facets) ?? undefined,
  });

  const tree = ((result.aggregations?.items as AggregationsStringTermsAggregate)
    ?.buckets as AggregationsStringTermsBucket[])
    ?.reduce<HierarchyFacetItem[]>((tree, bucket) => {
      (bucket.key as string).split(separator).reduce((children, id, idx, parts) => {
        const path = parts.slice(0, idx + 1).join(separator);
        let item = children.find((x) => x.id === path);
        if (!item) {
          const label = getLabel(data.key, id).join(' ').trim();
          item = {
            id: path,
            label: label.length > 0 ? label : id,
            count: 0,
            children: [],
          };
          children.push(item);
        }

        if (idx === parts.length - 1) {
          item.count = bucket.doc_count;
        }

        return item.children ?? [];
      }, tree);

      return tree;
    }, []) ?? [];

  countMissing(tree);
  return tree;
}

export default hierarchyFacetItems;
