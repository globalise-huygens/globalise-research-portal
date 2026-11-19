import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { VFile } from 'vfile';

export async function readSources(contentDir: string): Promise<VFile[]> {
  const paths = await readSourcePaths(contentDir);
  return Promise.all(paths.map(async (path) => new VFile({
    cwd: contentDir,
    path,
    value: await readFile(join(contentDir, path)),
  })));
}

async function readSourcePaths(contentDir: string): Promise<string[]> {
  const entries = await readdir(join(contentDir, 'pages'), { recursive: true });
  return entries
    .filter((entry) => entry.endsWith('.md'))
    .map((entry) => join('pages', entry))
    .sort();
}
