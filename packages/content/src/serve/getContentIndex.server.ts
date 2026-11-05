import { createServerFn } from '@tanstack/react-start';
import { indexFile } from '../contentFiles.ts';
import { readContentFile } from './readContentFile.server.ts';
import type { ContentIndex } from '../ContentPage.ts';

export const getContentIndexServer = createServerFn()
  .handler(async (): Promise<ContentIndex> => {
    try {
      return JSON.parse(await readContentFile(indexFile)) as ContentIndex;
    } catch (error) {
      console.error('Globalise content unavailable:', error);
      return [];
    }
  });
