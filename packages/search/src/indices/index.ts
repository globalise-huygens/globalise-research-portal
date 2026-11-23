import documents from './documents';

export const indices = {
  documents,
  // persons,
} as const;

export type IndexKey = keyof typeof indices;
export const indexKeys = Object.keys(indices) as IndexKey[];
