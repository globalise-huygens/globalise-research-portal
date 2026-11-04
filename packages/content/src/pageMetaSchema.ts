import { z } from 'zod';

export const slugPattern = /^[a-z0-9-]+$/;

const text = z.string().trim().min(1, { abort: true });
const slug = text.regex(slugPattern, 'use lowercase letters, digits and hyphens');
const optionalText = text.optional().catch(undefined);

export const pageMetaSchema = z.object({
  title: text,
  slug,
  summary: optionalText,
  type: optionalText,
  status: optionalText,
});

export const recommendedFieldsSchema = z.object({
  summary: text,
  type: text,
  status: text,
});
