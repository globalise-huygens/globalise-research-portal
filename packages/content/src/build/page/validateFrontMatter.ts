import { createErrorIssue } from '../Issue.ts';
import { requiredFrontmatterSchema, optionalFrontmatterSchema } from '../../pageMetaSchema.ts';
import type { z } from 'zod';
import type { PageMeta } from '../../ContentPage.ts';
import type { Issue } from '../Issue.ts';
import type { FrontMatter } from './readFrontMatter.ts';

/**
 * Invalidate missing or invalid required fields, remove invalid optional fields
 */
export function validateFrontMatter(
  frontMatter: FrontMatter, 
  path: string,
): {
  meta?: PageMeta;
  issues: Issue[];
} {
  const required = requiredFrontmatterSchema.safeParse(frontMatter.fields);
  if (!required.success) {
    const issues = required.error.issues
      .map((issue) => createFieldIssue(issue, frontMatter));
    return { issues };
  }
  const optional = optionalFrontmatterSchema.parse(frontMatter.fields);
  return { meta: { path, ...required.data, ...optional }, issues: [] };
}

function createFieldIssue(
  issue: z.core.$ZodIssue,
  frontMatter: FrontMatter,
): Issue {
  const field = String(issue.path[0]);
  const missing = isMissing(issue, frontMatter.fields[field]);
  const reason = missing
    ? `Missing required field \`${field}\``
    : `Invalid required field \`${field}\`: ${issue.message}`;
  const ruleId = missing
    ? 'missing-field'
    : 'invalid-field';
  return createErrorIssue(reason, ruleId, frontMatter.places.get(field));
}

function isMissing(
  issue: z.core.$ZodIssue, 
  value: unknown,
): boolean {
  return value === undefined || value === null || issue.code === 'too_small';
}
