import type MiniSearch from 'minisearch';
import type { Options } from 'minisearch';
import type { PageMeta } from '../ContentPage.ts';

export type ContentSearchIndex = MiniSearch<ContentSearchDocument>;

export type ContentSearchDocument = {
  text: string;
} & Pick<
  PageMeta,
  'slug' | 'title' | 'summary' | 'type' | 'status'
>;

export const contentSearchIndexOptions: Options<ContentSearchDocument> = {
  idField: 'slug',
  fields: ['title', 'summary', 'type', 'status', 'text'],
  storeFields: ['title', 'type', 'status', 'text'],
  searchOptions: { prefix: true },
};
