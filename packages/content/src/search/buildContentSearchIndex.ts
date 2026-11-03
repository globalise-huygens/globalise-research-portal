import MiniSearch from 'minisearch';
import { toText } from 'hast-util-to-text';
import { contentSearchIndexOptions } from './contentSearchIndex.ts';
import type { ContentPage } from '../ContentPage.ts';
import type { ContentSearchDocument, ContentSearchIndex } from './contentSearchIndex.ts';

export function buildContentSearchIndex(
  pages: ContentPage[],
): ContentSearchIndex {
  const index = new MiniSearch(contentSearchIndexOptions);
  index.addAll(pages.map(toSearchDocument));
  return index;
}

function toSearchDocument({ meta, tree }: ContentPage): ContentSearchDocument {
  const { slug, title, summary, type, status } = meta;
  return { slug, title, summary, type, status, text: toText(tree) };
}
