import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { VFile } from 'vfile';

export async function writeReport(files: VFile[], reportDir: string) {
  await mkdir(reportDir, { recursive: true });
  await writeMessages(files, join(reportDir, 'errors.json'), true);
  await writeMessages(files, join(reportDir, 'warnings.json'), false);
}

async function writeMessages(files: VFile[], path: string, fatal: boolean) {
  const report = files
    .map((file) => ({
      path: file.path,
      messages: file.messages.filter((message) => message.fatal === fatal),
    }))
    .filter((entry) => entry.messages.length);
  await writeFile(path, JSON.stringify(report, null, 2));
}
