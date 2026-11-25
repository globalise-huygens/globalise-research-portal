import type { z } from 'zod';

export function parseValidFields<T extends z.ZodObject>(
  schema: T,
  fields: Record<string, unknown>,
): {
  data: z.output<T>;
  issues: z.core.$ZodIssue[];
} {
  const { error } = schema.safeParse(fields);
  const invalid = new Set(error?.issues.map(({ path }) => path[0]));
  const valid = Object.fromEntries(
    Object.entries(fields).filter(([key]) => !invalid.has(key)),
  );
  return { data: schema.parse(valid), issues: error?.issues ?? [] };
}
