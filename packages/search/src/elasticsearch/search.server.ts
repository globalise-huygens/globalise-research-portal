import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import elastic from './client.server';
import { getSearchQuery, GlobaliseSearchStateSchema } from './elastic.server';

import type { EntityTagType } from '@globalise/design';
import type { GlobaliseSearchState } from '../utils/getSearchState';

const PRE_TAG = '\uE000';
const POST_TAG = '\uE001';

export type SearchRequest = GlobaliseSearchState & {
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
  inventoryNumber: string;
  settlement: string;
  startDate: string;
  endDate: string;
  text?: string;
};

type ElasticDocument = {
  identifier: string;
  inventoryNumber: string;
  title: string;
  settlement: string;
  startDate: string;
  endDate: string;
};

const SearchRequestSchema = GlobaliseSearchStateSchema.extend({
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
        type: 'unified',
        number_of_fragments: 0,
        pre_tags: [PRE_TAG],
        post_tags: [POST_TAG],
        fields: {
          text: {},
        },
      },
      _source: [
        'identifier',
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
        'NL-HaNA 1.04.02',
        'Deel I Heren Zeventien en kamer Amsterdam',
        'Deel I/E INGEKOMEN STUKKEN UIT INDIË',
        'Deel I/E.5 Overgekomen brieven en papieren',
        'Deel I/E.5.a Overgekomen brieven en papieren uit Indië aan de Heren XVII en de kamer Amsterdam',
        '1053-1055 Overgekomen brieven en papieren uit Indië aan de Heren XVII en de kamer Amsterdam. Met inhoudsopgaven',
        '1053 Stukken betreffende de Molukken, Banda, Ambon, Bantam, Makassar en Gresik',
      ],
      inventoryNumber: hit._source!.inventoryNumber,
      settlement: hit._source!.settlement,
      startDate: hit._source!.startDate,
      endDate: hit._source!.endDate,
      text: hit.highlight?.text ? hit.highlight?.text[0] : undefined,
    }));
  });

export default search;
