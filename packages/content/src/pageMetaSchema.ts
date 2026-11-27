import { z } from 'zod';
import { assetPathSchema } from './assetPathSchema.ts';

export const slugPattern = /^[a-z0-9-]+$/;

const text = z.string({ error: (issue) => issue.input === undefined ? 'missing' : undefined })
  .trim()
  .min(1, { error: 'missing', abort: true });
const slug = text.regex(slugPattern, 'use lowercase letters, digits and hyphens');

export const requiredFrontmatterSchema = z.object({
  title: text,
  summary: text,
  type: text,
  slug: slug,
  status: text,
  authors: z.array(text),
  featured: z.boolean(),
});

export const optionalFrontmatterSchema = z.object({
  subtitle: optional(text),
  datePublished: optional(z.iso.date()),
  dateUpdated: optional(z.iso.date()),
  related: optional(z.array(slug)),
  originalPublication: optional(z.object({
    url: z.url(),
    date: z.iso.date(),
  })),
  hero: optional(z.object({
    src: text.pipe(assetPathSchema),
    alt: optional(text),
    caption: optional(text),
    credit: optional(text),
    source: optional(text),
    licence: optional(text),
  })),
});

function optional<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => isBlank(value) ? undefined : value, schema.optional()).optional();
}

function isBlank(value: unknown): boolean {
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).every(isBlank);
  }
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}
