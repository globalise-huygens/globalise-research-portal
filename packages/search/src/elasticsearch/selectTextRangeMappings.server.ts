import { DatabaseSync, type StatementSync } from 'node:sqlite';
import { createCanvasId, parseCanvasName } from '@globalise/common/uri';
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

let isInitDatabase = false;
let database: GlobaliseDatabase | undefined;

export function selectTextRangeMappings(
  docDbId: string,
): TextRangeMapping[] {
  if (!isInitDatabase) {
    isInitDatabase = true;
    database = initDatabase();
  }
  if (!database) {
    console.warn('Globalise db unavailable: returning empty mappings list');
    return [];
  }
  const rows = database.selectMappings.all(docDbId) as TextRangeMappingRow[];
  return rows.flatMap(({ shortPageId, ...mapping }) => {
    const page = parseCanvasName(canvasNamePrefix + shortPageId);
    return page ? [{ ...mapping, canvasId: createCanvasId(page) }] : [];
  });
}

type GlobaliseDatabase = {
  database: DatabaseSync;
  selectMappings: StatementSync;
};

function initDatabase(): GlobaliseDatabase | undefined {
  try {
    const database = openDatabase();
    const selectMappings = database.prepare(selectMappingsWhereDocumentIdQuery);
    return { database, selectMappings };
  } catch (error) {
    console.error('Globalise db unavailable:', error);
    return undefined;
  }
}

function openDatabase(): DatabaseSync {
  const dbPathEnvKey = 'GLOBALISE_DB';
  const dbPath = process.env[dbPathEnvKey];
  if (!dbPath) {
    throw new Error(`${dbPathEnvKey} is not set`);
  }
  return new DatabaseSync(dbPath, { readOnly: true });
}
