import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { IssueLevel } from './Issue.ts';
import type { ReportMessage } from './ReportMessage.ts';

export async function writeReport(
  messages: ReportMessage[],
  reportDir: string,
) {
  await mkdir(reportDir, { recursive: true });
  await writeReportLevel(messages, join(reportDir, 'errors.json'), 'error');
  await writeReportLevel(messages, join(reportDir, 'warnings.json'), 'warning');
}

async function writeReportLevel(
  messages: ReportMessage[],
  path: string,
  level: IssueLevel,
) {
  const report = messages.filter((message) => message.level === level);
  if (report.length) {
    await writeFile(path, JSON.stringify(report, null, 2));
  }
}
