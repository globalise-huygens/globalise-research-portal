import type { Options } from 'minisearch';
import type { PageMeta } from '../ContentPage.ts';

export type ContentSearchDocument = {
  text: string;
} & Pick<
  PageMeta,
  'slug' | 'title' | 'summary' | 'type' | 'status'
>;

export const contentSearchOptions: Options<ContentSearchDocument> = {
  idField: 'slug',
  fields: ['title', 'summary', 'type', 'status', 'text'],
  storeFields: ['title', 'type', 'status', 'text'],
  searchOptions: { prefix: true, fuzzy: 0.2 },
};
