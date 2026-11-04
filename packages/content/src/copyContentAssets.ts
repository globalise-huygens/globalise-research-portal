import { existsSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import { join } from 'node:path';
import { assetsDir } from './contentFiles.ts';

export async function copyContentAssets(contentDir: string, outputDir: string) {
  const sourceDir = join(contentDir, assetsDir);
  if (existsSync(sourceDir)) {
    await cp(sourceDir, join(outputDir, assetsDir), { recursive: true });
  }
}
