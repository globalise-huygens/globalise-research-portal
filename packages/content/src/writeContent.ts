import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ContentBuild } from './buildContent.ts';
import type { ContentIndex } from './ContentPage.ts';

export async function writeContent(build: ContentBuild, outputDir: string) {
  const index: ContentIndex = build.pages.map((page) => page.meta);
  await mkdir(join(outputDir, 'pages'), { recursive: true });
  await writeFile(join(outputDir, 'index.json'), JSON.stringify(index, null, 2));
  await Promise.all(build.pages.map((page) =>
    writeFile(join(outputDir, 'pages', `${page.meta.slug}.json`), JSON.stringify(page)),
  ));
}
