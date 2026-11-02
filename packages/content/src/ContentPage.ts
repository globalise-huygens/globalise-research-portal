import type { Root } from 'hast';

export type ContentPage = {
  meta: PageMeta;
  htmlTree: Root;
};

export type PageMeta = {
  path: string;
  title: string;
  slug: string;
  summary?: string;
  type?: string;
  status?: string;
};

export type ContentIndex = PageMeta[];
