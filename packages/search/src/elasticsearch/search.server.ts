import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import elastic from './client.server';
import { facets, getSearchQuery } from './elastic.server';
import { POST_TAG, PRE_TAG } from './highlightTags';

import type { EntityTagType } from '@globalise/design';
import type { TreeQuery } from '@knaw-huc/searchfield';

export type SearchRequest = {
  query?: TreeQuery;
  facets: Record<string, string[]>;
  offset?: number;
  limit?: number;
};

export type SearchResult = {
  id: string;
  type: EntityTagType;
  title: string;
};

export type DocumentSearchResult = SearchResult & {
  type: 'document';
  archive: string[];
  name: string;
  inventoryNumber: string;
  settlement: string;
  startDate: string;
  endDate: string;
  mentions: string[];
};

type ElasticDocument = {
  identifier: string;
  name: string;
  inventoryNumber: string;
  title: string;
  settlement: string;
  startDate: string;
  endDate: string;
};

const SearchRequestSchema = z.object({
  query: z.looseObject({}).optional() as unknown as z.ZodType<TreeQuery | undefined>,
  facets: z.record(z.string(), z.array(z.string())).refine(
    (record) => Object.keys(record).every((key) => Object.keys(facets).includes(key)),
    { error: 'Invalid facet key applied!' },
  ),
  offset: z.number().min(0).optional(),
  limit: z.number().min(1).optional(),
});

const search = createServerFn({ method: 'POST' })
  .validator(SearchRequestSchema)
  .handler(async ({ data }): Promise<SearchResult[]> => {
    const esQuery = getSearchQuery(data.query, data.facets) ?? undefined;
    console.log('ElasticSearch query', JSON.stringify(esQuery, null, 2));

    const result = await elastic.search<ElasticDocument>({
      index: 'documents',
      from: data.offset ?? 0,
      size: data.limit ?? 10,
      highlight: {
        pre_tags: [PRE_TAG],
        post_tags: [POST_TAG],
        fields: {
          text: {},
        },
      },
      _source: [
        'identifier',
        'name',
        'inventoryNumber',
        'title',
        'settlement',
        'startDate',
        'endDate',
      ],
      query: esQuery,
    });

    return result.hits.hits.map((hit) => ({
      id: hit._source!.identifier,
      type: 'document',
      title: hit._source!.title,
      archive: [
        'TODO',
        'TODO',
        'TODO',
        'TODO',
        'TODO',
        'TODO',
        'TODO',
      ],
      name: hit._source!.name,
      inventoryNumber: hit._source!.inventoryNumber,
      settlement: hit._source!.settlement,
      startDate: hit._source!.startDate,
      endDate: hit._source!.endDate,
      mentions: hit.highlight?.text ?? [],
    }));
  });

export default search;
