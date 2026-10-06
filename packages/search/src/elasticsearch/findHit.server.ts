import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import { fetchDocumentText } from './fetchDocumentText.server';
import { findSnippetHit, type Hit } from './findSnippetHit';

export type FindHitRequest = {
  documentId: string;
  snippet: string;
};

const FindHitRequestSchema = z.object({
  documentId: z.string(),
  snippet: z.string(),
});

const findHit = createServerFn({ method: 'POST' })
  .validator(FindHitRequestSchema)
  .handler(async ({ data }): Promise<Hit | null> => {
    const text = await fetchDocumentText(data.documentId);
    return findSnippetHit(text, data.snippet);
  });

export default findHit;
