import type { Point, Position } from 'unist';
import type { VFile } from 'vfile';

export type Issue = {
  reason: string;
  ruleId: string;
  fatal: boolean;
  place?: Point | Position;
};

export function createErrorIssue(
  reason: string,
  ruleId: string,
  place?: Point | Position,
): Issue {
  return { reason, ruleId, fatal: true, place };
}

export function createWarningIssue(
  reason: string,
  ruleId: string,
  place?: Point | Position,
): Issue {
  return { reason, ruleId, fatal: false, place };
}

export function addIssues(file: VFile, issues: Issue[]) {
  for (const { reason, ruleId, fatal, place } of issues) {
    const message = file.message(reason, { place, ruleId, source: 'content' });
    message.fatal = fatal;
  }
}
