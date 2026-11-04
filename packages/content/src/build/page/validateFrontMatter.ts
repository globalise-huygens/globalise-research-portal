import { createErrorIssue, createWarningIssue } from '../Issue.ts';
import { pageMetaSchema, recommendedFieldsSchema } from '../../pageMetaSchema.ts';
import type { z } from 'zod';
import type { PageMeta } from '../../ContentPage.ts';
import type { Issue } from '../Issue.ts';
import type { FrontMatter } from './readFrontMatter.ts';

/**
 * Invalidate:
 * - missing or invalid required fields
 * - missing or invalid recommended fields, as warnings
 */
export function validateFrontMatter(frontMatter: FrontMatter, path: string): {
  meta?: PageMeta;
  issues: Issue[];
} {
  const meta = pageMetaSchema.safeParse(frontMatter.fields);
  const recommended = recommendedFieldsSchema.safeParse(frontMatter.fields);
  const requiredIssues = meta.error?.issues ?? [];
  const recommendedIssues = recommended.error?.issues ?? [];
  const issues = [
    ...requiredIssues.map((issue) => createFieldIssue(issue, frontMatter, true)),
    ...recommendedIssues.map((issue) => createFieldIssue(issue, frontMatter, false)),
  ];
  return {
    meta: meta.success
      ? { path, ...meta.data }
      : undefined,
    issues,
  };
}

function createFieldIssue(
  issue: z.core.$ZodIssue,
  frontMatter: FrontMatter,
  required: boolean,
): Issue {
  const field = String(issue.path[0]);
  const label = required
    ? 'required field'
    : 'recommended field';
  const missing = isMissing(issue, frontMatter.fields[field]);
  const reason = missing
    ? `Missing ${label} \`${field}\``
    : `Invalid ${label} \`${field}\`: ${issue.message}`;
  const ruleId = missing
    ? 'missing-field'
    : 'invalid-field';
  const place = frontMatter.places.get(field);
  return required
    ? createErrorIssue(reason, ruleId, place)
    : createWarningIssue(reason, ruleId, place);
}

function isMissing(issue: z.core.$ZodIssue, value: unknown): boolean {
  return value === undefined || value === null || issue.code === 'too_small';
}
