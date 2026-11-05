import { addIssues } from './Issue.ts';
import { buildPage } from './page/buildPage.ts';
import { readSources } from './readSources.ts';
import { validateSlugs } from './validateSlugs.ts';
import type { VFile } from 'vfile';
import type { ContentPage } from '../ContentPage.ts';

export type ContentBuild = {
  sources: VFile[];
  pages: ContentPage[];
};

export async function buildContent(contentDir: string): Promise<ContentBuild> {
  const sources = await readSources(contentDir);
  const builds = validateSlugs(await Promise.all(sources.map(buildPage)));
  for (const { source, issues } of builds) {
    addIssues(source, issues);
  }
  const pages = builds
    .map(({ page }) => page)
    .filter((page) => !!page);
  return { sources, pages };
}
