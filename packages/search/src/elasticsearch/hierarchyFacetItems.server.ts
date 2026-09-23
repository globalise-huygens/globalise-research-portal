import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import { AggregationsStringTermsAggregate, AggregationsStringTermsBucket } from '@elastic/elasticsearch/lib/api/types';
import elastic from './client.server';
import { getLabel } from './labels.server';
import { facets, getSearchQuery } from './elastic.server';

export type HierarchyFacetItemsRequest = {
  key: string;
  query?: string;
  facets?: Record<string, string[]>;
};

export type HierarchyFacetItem = {
  id: string;
  label: string;
  count: number;
  children?: HierarchyFacetItem[];
};

const HierarchyFacetItemsRequestSchema = z.object({
  key: z.enum(Object.keys(facets)),
  query: z.string().optional(),
  facets: z.record(z.string(), z.array(z.string())).refine(
    (record) => Object.keys(record).every((key) => Object.keys(facets).includes(key)),
    { error: 'Invalid facet key requested!' },
  ).optional(),
});

const separator = '|';
const cache = new Map<string, Promise<HierarchyFacetItem[]>>();

const hierarchyFacetItems = createServerFn({ method: 'POST' })
  .validator(HierarchyFacetItemsRequestSchema)
  .handler(async ({ data }) => {
    if (!data.query && (!data.facets || Object.keys(data.facets).length === 0)) {
      if (!cache.has(data.key)) {
        cache.set(data.key, getHierarchyFacetItems(data));
      }
      return cache.get(data.key)!;
    }
    return getHierarchyFacetItems(data);
  });

async function getHierarchyFacetItems(data: HierarchyFacetItemsRequest) {
  const result = await elastic.search({
    index: 'documents',
    size: 0,
    aggs: {
      items: {
        terms: {
          field: facets[data.key].tree,
          size: 10000,
          order: {
            _count: 'desc',
          },
        },
      },
    },
    query: getSearchQuery(data.query, data.facets),
  });

  return ((result.aggregations?.items as AggregationsStringTermsAggregate)
    ?.buckets as AggregationsStringTermsBucket[])
    ?.reduce<HierarchyFacetItem[]>((tree, bucket) => {
      (bucket.key as string).split(separator).reduce((children, id, idx, parts) => {
        let item = children.find((x) => x.id === id);
        if (!item) {
          const label = getLabel(data.key, id).join(' ').trim();
          item = {
            id,
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
}

export default hierarchyFacetItems;
