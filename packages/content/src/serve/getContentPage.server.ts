import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { toPageFile } from '../contentFiles.ts';
import { slugPattern } from '../pageMetaSchema.ts';
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
      if (isMissingFile(error)) {
        console.warn(`Not found: content page ${slug}`);
      } else {
        console.error(`Globalise content page ${slug} unavailable:`, error);
      }
      throw notFound();
    }
  });

function isMissingFile(error: unknown): boolean {
  return (error as NodeJS.ErrnoException).code === 'ENOENT';
}
