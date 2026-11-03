import type { Point, Position } from 'unist';
import type { VFile } from 'vfile';

export type Issue = {
  reason: string;
  ruleId: string;
  level: IssueLevel;
  place?: Point | Position;
};

export type IssueLevel = 'error' | 'warning';

export function createErrorIssue(
  reason: string,
  ruleId: string,
  place?: Point | Position,
): Issue {
  return { reason, ruleId, level: 'error', place };
}

export function createWarningIssue(
  reason: string,
  ruleId: string,
  place?: Point | Position,
): Issue {
  return { reason, ruleId, level: 'warning', place };
}

export function addIssues(file: VFile, issues: Issue[]) {
  for (const { reason, ruleId, level, place } of issues) {
    const message = file.message(reason, { place, ruleId, source: 'content' });
    message.fatal = level === 'error';
  }
}
