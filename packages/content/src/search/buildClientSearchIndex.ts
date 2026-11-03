import MiniSearch from 'minisearch';
import { toText } from 'hast-util-to-text';
import { contentSearchOptions } from './contentSearchOptions.ts';
import type { ContentPage } from '../ContentPage.ts';
import type { ContentSearchDocument } from './contentSearchOptions.ts';

export function buildClientSearchIndex(
  pages: ContentPage[],
): MiniSearch<ContentSearchDocument> {
  const index = new MiniSearch(contentSearchOptions);
  index.addAll(pages.map(toSearchDocument));
  return index;
}

function toSearchDocument({ meta, tree }: ContentPage): ContentSearchDocument {
  const { slug, title, summary, type, status } = meta;
  return { slug, title, summary, type, status, text: toText(tree) };
}
