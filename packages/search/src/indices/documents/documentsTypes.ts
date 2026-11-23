import type { SearchResult } from '../indexTypes';

export type DocumentSearchResult = SearchResult & {
  type: 'document';
  archive: string[];
  name: string;
  inventoryNumber: string;
  settlement: string;
  startDate: string;
  endDate: string;
  mentions: string[];
};

export type ElasticDocument = {
  identifier: string;
  name: string;
  inventoryNumber: string;
  title: string;
  settlement: string;
  startDate: string;
  endDate: string;
};