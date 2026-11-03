import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { slugPattern } from '@globalise/content';
import { readContentFile } from './content.server.ts';
import type { ContentIndex, ContentPage } from '@globalise/content';

export const getContentIndex = createServerFn().handler(async (): Promise<ContentIndex> => {
  try {
    return JSON.parse(await readContentFile('index.json')) as ContentIndex;
  } catch (error) {
    console.error('Globalise content unavailable:', error);
    return [];
  }
});

export const getContentPage = createServerFn()
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<ContentPage> => {
    if (!slugPattern.test(slug)) {
      throw notFound();
    }
    try {
      return JSON.parse(await readContentFile(`pages/${slug}.json`)) as ContentPage;
    } catch (error) {
      console.error(`Globalise content page ${slug} unavailable:`, error);
      throw notFound();
    }
  });
