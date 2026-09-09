import { createServerFn } from '@tanstack/react-start';
import { AggregationsStringTermsAggregate, AggregationsStringTermsBucket } from '@elastic/elasticsearch/lib/api/types';
import { getLabel } from './labels.server';
import elastic from './client.server';

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

const separator = '|';

const hierarchyFacetItems = createServerFn({ method: 'POST' })
  .validator((input: HierarchyFacetItemsRequest) => input)
  .handler(async ({ data }) => {
    const result = await elastic.search({
      index: 'documents',
      size: 0,
      aggs: {
        items: {
          terms: {
            field: data.key,
            size: 10000,
            order: {
              _count: 'desc',
            },
          },
        },
      },
      query: data.facets || data.query ? {
        bool: {
          must: [
            // TODO: Determine how query string must be interpreted
            ...(data.query ? [{
              simple_query_string: {
                query: data.query,
                fields: ['*'],
              },
            }] : []),
            // TODO: Validate user input: do facet keys exist?
            ...(data.facets && Object.keys(data.facets).length > 0 ? [{
              terms: data.facets,
            }] : []),
          ],
        },
      } : undefined,
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
  });

export default hierarchyFacetItems;
