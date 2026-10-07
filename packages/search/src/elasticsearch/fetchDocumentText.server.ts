import { QueryClient } from '@tanstack/react-query';
import elastic from './client.server';

const queryClient = new QueryClient();

/**
 * Fetch and cache a document text from elasticsearch
 */
export function fetchDocumentText(documentId: string): Promise<string> {
  return queryClient.fetchQuery({
    queryKey: ['documentText', documentId],
    queryFn: () => queryDocumentText(documentId),
    // Remove but do not refetch after 5 minutes:
    gcTime: 5 * 60 * 1000,
    staleTime: Infinity,
  });
}

async function queryDocumentText(documentId: string): Promise<string> {
  const result = await elastic.search<{ text: string }>({
    index: 'documents',
    size: 1,
    _source: ['text'],
    query: { ids: { values: [documentId] } },
  });
  return result.hits.hits[0]._source!.text;
}
