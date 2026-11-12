import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { writeReport } from './writeReport.ts';
import type { ReportMessage } from './ReportMessage.ts';

describe(writeReport.name, () => {
  it('writes only the levels that have messages', async () => {
    const reportDir = mkdtempSync(join(tmpdir(), 'report-'));
    await writeReport([createMessage()], reportDir);
    expect(existsSync(join(reportDir, 'errors.json'))).toBe(true);
    expect(existsSync(join(reportDir, 'warnings.json'))).toBe(false);
  });
});

function createMessage(): ReportMessage {
  const location = { file: 'a.md', full: 'a.md' };
  return { location, level: 'error', reason: 'foo' };
}
