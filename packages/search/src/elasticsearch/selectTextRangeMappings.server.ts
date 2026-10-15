import { DatabaseSync, type StatementSync } from 'node:sqlite';
import { toCanvasId } from '@globalise/common/document';
import type { TextRangeMapping } from './calculateHtrOffsets';

type TextRangeMappingRow = Omit<TextRangeMapping, 'canvasId'> & {
  shortPageId: string;
};

const canvasNamePrefix = 'NL-HaNA_1.04.02_';

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
  docDbId: string,
): TextRangeMapping[] {
  statement ??= openDatabase().prepare(selectMappingsWhereDocumentIdQuery);
  const rows = statement.all(docDbId) as TextRangeMappingRow[];
  return rows.map(({ shortPageId, ...mapping }) => ({
    ...mapping,
    canvasId: toCanvasId(canvasNamePrefix + shortPageId),
  }));
}

function openDatabase(): DatabaseSync {
  const dbPathEnvKey = 'DOCUMENT_TEXT_MAPPINGS_DB';
  const dbPath = process.env[dbPathEnvKey];
  if (!dbPath) {
    throw new Error(`${dbPathEnvKey} is not set`);
  }
  return new DatabaseSync(dbPath, { readOnly: true });
}
