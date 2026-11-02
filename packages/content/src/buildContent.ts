import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { VFile } from 'vfile';
import { addIssues, createErrorIssue } from './Issue.ts';
import { processPage } from './processPage.ts';
import type { Issue } from './Issue.ts';
import type { ContentIndex, ContentPage } from './ContentPage.ts';

export type ContentBuild = {
  files: VFile[];
  pages: ContentPage[];
};

export async function buildContent(contentDir: string): Promise<ContentBuild> {
  const paths = await readPagePaths(contentDir);
  const files = await Promise.all(paths.map(async (path) => new VFile({
    cwd: contentDir,
    path,
    value: await readFile(join(contentDir, path)),
  })));
  const pages: ContentPage[] = [];
  const slugs = new Map<string, string>();

  for (const file of files) {
    const { page, issues } = await processPage(file);
    addIssues(file, issues);
    if (!page) {
      continue;
    }
    const duplicate = slugs.get(page.meta.slug);
    if (duplicate) {
      addIssues(file, [createDuplicateSlugIssue(page.meta.slug, duplicate)]);
      continue;
    }
    slugs.set(page.meta.slug, file.path);
    pages.push(page);
  }

  return { files, pages };
}

export async function writeContent(build: ContentBuild, outputDir: string) {
  const index: ContentIndex = build.pages.map((page) => page.meta);
  await mkdir(join(outputDir, 'pages'), { recursive: true });
  await writeFile(join(outputDir, 'index.json'), JSON.stringify(index, null, 2));
  await Promise.all(build.pages.map((page) =>
    writeFile(join(outputDir, 'pages', `${page.meta.slug}.json`), JSON.stringify(page)),
  ));
}

async function readPagePaths(contentDir: string): Promise<string[]> {
  const entries = await readdir(join(contentDir, 'pages'), { recursive: true });
  return entries
    .filter((entry) => entry.endsWith('.md'))
    .map((entry) => join('pages', entry))
    .sort();
}

function createDuplicateSlugIssue(slug: string, otherPath: string): Issue {
  const reason = `Duplicate slug \`${slug}\`, also used by \`${otherPath}\``;
  return createErrorIssue(reason, 'duplicate-slug');
}
