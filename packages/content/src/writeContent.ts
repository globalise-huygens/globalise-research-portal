import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { indexFile, pagesDir, searchIndexFile, toPageFile } from './contentFiles.ts';
import { buildContentSearchIndex } from './search/buildContentSearchIndex.ts';
import type { ContentBuild } from './buildContent.ts';
import type { ContentIndex } from './ContentPage.ts';

export async function writeContent(build: ContentBuild, outputDir: string) {
  const index: ContentIndex = build.pages.map((page) => page.meta);
  await mkdir(join(outputDir, pagesDir), { recursive: true });
  await writeFile(join(outputDir, indexFile), JSON.stringify(index, null, 2));

  const searchIndex = buildContentSearchIndex(build.pages);
  await writeFile(join(outputDir, searchIndexFile), JSON.stringify(searchIndex));

  await Promise.all(build.pages.map((page) =>
    writeFile(join(outputDir, toPageFile(page.meta.slug)), JSON.stringify(page)),
  ));
}
