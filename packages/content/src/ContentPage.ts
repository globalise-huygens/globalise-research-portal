import type { Root } from 'hast';
import type { z } from 'zod';
import type { optionalFrontmatterSchema, requiredFrontmatterSchema } from './pageMetaSchema.ts';

export type ContentPage = {
  meta: PageMeta;
  tree: Root;
};

export type PageMeta = z.infer<typeof requiredFrontmatterSchema> & z.infer<typeof optionalFrontmatterSchema> & {
  path: string;
};

export type ContentIndex = PageMeta[];
