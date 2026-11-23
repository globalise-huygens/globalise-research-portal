import type { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import type { DocumentSearchResult, ElasticDocument } from './documentsTypes';

export function toDocumentResult(hit: SearchHit<ElasticDocument>): DocumentSearchResult {
  return {
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
    mentions: hit.highlight?.annotatedText ?? [],
  };
}