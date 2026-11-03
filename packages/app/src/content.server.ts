import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export function readContentFile(path: string): Promise<string> {
  return readFile(join(getContentDir(), path), 'utf8');
}

function getContentDir(): string {
  const contentDirEnvKey = 'GLOBALISE_CONTENT';
  const contentDir = process.env[contentDirEnvKey];
  if (!contentDir) {
    throw new Error(`${contentDirEnvKey} is not set`);
  }
  return contentDir;
}
