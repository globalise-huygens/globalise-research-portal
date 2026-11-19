import { join } from 'node:path';
import type { VFile } from 'vfile';
import type { IssueLevel } from './Issue.ts';

export type ReportMessage = {
  location: ReportLocation;
  level: IssueLevel;
  reason: string;
  ruleId?: string;
};

type ReportLocation = {
  file: string;
  line?: number;
  column?: number;
  full: string;
};

type SourceMessage = VFile['messages'][number];

export function toReportMessage(
  message: SourceMessage,
  contentDir: string,
): ReportMessage {
  const { line, column, fatal, reason, ruleId } = message;
  const file = join(contentDir, message.file ?? '');
  const full = [file, line, column].filter(Boolean).join(':');
  return {
    location: { file, line, column, full },
    level: fatal ? 'error' : 'warning',
    reason,
    ruleId,
  };
}

export function formatReportMessage(
  { location, level, reason }: ReportMessage,
): string {
  return `${level.toUpperCase()}: ${reason}, file: ${location.full}`;
}
