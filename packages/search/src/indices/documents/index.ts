import type { SearchIndex } from '../indexTypes';
import { DocumentResultContent } from './DocumentResultContent';
import type { DocumentSearchResult, ElasticDocument } from './documentsTypes';
import { hierarchyFacets, rangeFacets } from './facets';
import parseQuery from './parseQuery.server';
import { toDocumentResult } from './toResult';

const documents: SearchIndex<ElasticDocument, DocumentSearchResult> = {
  key: 'documents',
  label: 'Documents',
  icon: 'document',
  esIndex: 'documents',
  compile: (query) => parseQuery(query),
  hierarchyFacets: hierarchyFacets,
  rangeFacets: rangeFacets,
  source: [
    'identifier',
    'name',
    'inventoryNumber',
    'title',
    'settlement',
    'startDate',
    'endDate',
  ],
  highlight: { fields: { annotatedText: { type: 'annotated' } } },
  toResult: toDocumentResult,
  ResultComponent: DocumentResultContent,
};
export default documents;
