import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {notFound} from '@tanstack/react-router';
import {createServerFn} from '@tanstack/react-start';
import type {ContentIndex, ContentPage} from '@globalise/content';

export const getContentIndex = createServerFn().handler(async (): Promise<ContentIndex> => {
  try {
    const indexPath = join(getContentDir(), 'index.json');
    const contentIndexContent = await readFile(indexPath, 'utf8');
    return JSON.parse(contentIndexContent) as ContentIndex;
  } catch (error) {
    console.error('Globalise content unavailable:', error);
    return [];
  }
});

export const getContentPage = createServerFn()
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<ContentPage> => {
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw notFound();
    }
    try {
      const pagePath = join(getContentDir(), 'pages', `${slug}.json`);
      return JSON.parse(await readFile(pagePath, 'utf8')) as ContentPage;
    } catch (error) {
      console.error(`Globalise content page ${slug} unavailable:`, error);
      throw notFound();
    }
  });

function getContentDir(): string {
  const contentDirEnvKey = 'GLOBALISE_CONTENT';
  const contentDir = process.env[contentDirEnvKey];
  if (!contentDir) {
    throw new Error(`${contentDirEnvKey} is not set`);
  }
  return contentDir;
}
