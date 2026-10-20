import { DatabaseSync, type StatementSync } from 'node:sqlite';
import { toCanvasId } from '@globalise/common/document';
import type { TextRangeMapping } from './calculateHtrOffsets';

type TextRangeMappingRow = Omit<TextRangeMapping, 'canvasId'> & {
  shortPageId: string;
};

const canvasNamePrefix = 'NL-HaNA_1.04.02_';

const selectMappingsWhereDocumentIdQuery = `
    select normalized_from         as normalizedFrom,
           normalized_to_exclusive as normalizedTo,
           short_page_id           as shortPageId,
           htr_page_offset         as htrPageOffset
    from document_text_range_mappings
    where document_id = ?
    order by normalized_from
`;

let mappingsDb: MappingsDb | undefined;

export function selectTextRangeMappings(
  docDbId: string,
): TextRangeMapping[] {
  mappingsDb ??= initMappingsDb();
  const rows = mappingsDb.selectMappings.all(docDbId) as TextRangeMappingRow[];
  return rows.map(({ shortPageId, ...mapping }) => ({
    ...mapping,
    canvasId: toCanvasId(canvasNamePrefix + shortPageId),
  }));
}

type MappingsDb = {
  database: DatabaseSync;
  selectMappings: StatementSync;
};

function initMappingsDb(): MappingsDb {
  const database = openDatabase();
  const selectMappings = database.prepare(selectMappingsWhereDocumentIdQuery);
  return { database, selectMappings };
}

function openDatabase(): DatabaseSync {
  const dbPathEnvKey = 'GLOBALISE_DB';
  const dbPath = process.env[dbPathEnvKey];
  if (!dbPath) {
    throw new Error(`${dbPathEnvKey} is not set`);
  }
  return new DatabaseSync(dbPath, { readOnly: true });
}
