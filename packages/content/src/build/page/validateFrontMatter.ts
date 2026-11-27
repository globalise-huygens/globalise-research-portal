import { createErrorIssue, createWarningIssue } from '../Issue.ts';
import { requiredFrontmatterSchema, optionalFrontmatterSchema } from '../../pageMetaSchema.ts';
import { parseValidFields } from './parseValidFields.ts';
import type { z } from 'zod';
import type { PageMeta } from '../../ContentPage.ts';
import type { Issue } from '../Issue.ts';
import type { FrontMatter } from './readFrontMatter.ts';

/**
 * Invalidate missing or invalid required fields, leave out invalid optional fields with a warning
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
      .map((issue) => createRequiredFieldIssue(issue, frontMatter));
    return { issues };
  }
  const optional = parseValidFields(optionalFrontmatterSchema, frontMatter.fields);
  const issues = optional.issues
    .map((issue) => createOptionalFieldIssue(issue, frontMatter));
  return { meta: { path, ...required.data, ...optional.data }, issues };
}

function createRequiredFieldIssue(
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

function createOptionalFieldIssue(
  issue: z.core.$ZodIssue,
  frontMatter: FrontMatter,
): Issue {
  const field = String(issue.path[0]);
  const reason = `\`${field}\` not included, \`${issue.path.join('.')}\`: ${issue.message}`;
  return createWarningIssue(reason, 'invalid-field', frontMatter.places.get(field));
}

function isMissing(
  issue: z.core.$ZodIssue, 
  value: unknown,
): boolean {
  return value === undefined || value === null || issue.code === 'too_small';
}
