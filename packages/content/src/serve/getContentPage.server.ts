import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { toPageFile } from '../contentFiles.ts';
import { slugPattern } from '../page/pageMetaSchema.ts';
import { readContentFile } from './readContentFile.server.ts';
import type { ContentPage } from '../ContentPage.ts';

export const getContentPageServer = createServerFn()
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<ContentPage> => {
    if (!slugPattern.test(slug)) {
      throw notFound();
    }
    try {
      return JSON.parse(await readContentFile(toPageFile(slug))) as ContentPage;
    } catch (error) {
      console.error(`Globalise content page ${slug} unavailable:`, error);
      throw notFound();
    }
  });
