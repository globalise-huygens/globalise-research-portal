import type { Root } from 'hast';
import type { z } from 'zod';
import type { pageMetaSchema } from './page/pageMetaSchema.ts';

export type ContentPage = {
  meta: PageMeta;
  tree: Root;
};

export type PageMeta = z.infer<typeof pageMetaSchema> & {
  path: string;
};

export type ContentIndex = PageMeta[];
