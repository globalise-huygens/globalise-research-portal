import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { VFile } from 'vfile';

export async function writeReport(sources: VFile[], reportDir: string) {
  await mkdir(reportDir, { recursive: true });
  await writeMessages(sources, join(reportDir, 'errors.json'), true);
  await writeMessages(sources, join(reportDir, 'warnings.json'), false);
}

async function writeMessages(sources: VFile[], path: string, fatal: boolean) {
  const report = sources
    .map((source) => ({
      path: source.path,
      messages: source.messages.filter((message) => message.fatal === fatal),
    }))
    .filter((entry) => entry.messages.length);
  await writeFile(path, JSON.stringify(report, null, 2));
}
