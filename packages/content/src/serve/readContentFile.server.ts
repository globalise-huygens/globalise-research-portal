import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export function readContentFile(path: string): Promise<string> {
  return readFile(toContentPath(path), 'utf8');
}

export function readContentAsset(path: string): Promise<Buffer<ArrayBuffer>> {
  return readFile(toContentPath(path));
}

function toContentPath(path: string): string {
  return join(getContentDir(), path);
}

function getContentDir(): string {
  const contentDirEnvKey = 'GLOBALISE_CONTENT';
  const contentDir = process.env[contentDirEnvKey];
  if (!contentDir) {
    throw new Error(`${contentDirEnvKey} is not set`);
  }
  return contentDir;
}
