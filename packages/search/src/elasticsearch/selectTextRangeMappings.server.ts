import { DatabaseSync, type StatementSync } from 'node:sqlite';
import type { TextRangeMapping } from './calculateHtrOffsets';

const selectMappingsWhereDocumentIdQuery = `
  select
    normalized_from as normalizedFrom,
    normalized_to as normalizedTo,
    short_page_id as shortPageId,
    htr_page_offset as htrPageOffset
  from document_text_range_mappings
  where document_id = ?
  order by normalized_from
`;

let statement: StatementSync | undefined;

export function selectTextRangeMappings(
  documentId: string,
): TextRangeMapping[] {
  statement ??= openDatabase().prepare(selectMappingsWhereDocumentIdQuery);
  return statement.all(documentId) as TextRangeMapping[];
}

function openDatabase(): DatabaseSync {
  const dbPathEnvKey = 'DOCUMENT_TEXT_MAPPINGS_DB';
  const dbPath = process.env[dbPathEnvKey];
  if (!dbPath) {
    throw new Error(`${dbPathEnvKey} is not set`);
  }
  return new DatabaseSync(dbPath, { readOnly: true });
}
