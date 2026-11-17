import { visit } from 'unist-util-visit';
import { toPageUrl } from '../contentFiles.ts';
import type { ContentPage } from '../ContentPage.ts';

export function buildPageLinks(pages: ContentPage[]) {
  const slugs = new Map(pages.map(({ meta }) => [`/${meta.path}`, meta.slug]));
  for (const { tree } of pages) {
    visit(tree, 'element', ({ properties }) => {
      const { href } = properties;
      if (typeof href !== 'string') {
        return;
      }
      const [path] = href.split('#');
      const slug = slugs.get(path);
      if (slug) {
        properties.href = href.replace(path, toPageUrl(slug));
      }
    });
  }
}
