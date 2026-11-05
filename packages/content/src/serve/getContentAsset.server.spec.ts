import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getContentAsset } from './getContentAsset.server.ts';

describe('getContentAsset', () => {
  beforeEach(() => {
    const contentDir = mkdtempSync(join(tmpdir(), 'content-'));
    mkdirSync(join(contentDir, 'assets/a'), { recursive: true });
    writeFileSync(join(contentDir, 'assets/a/b c.png'), 'foo');
    writeFileSync(join(contentDir, 'assets/a/b.md'), 'foo');
    writeFileSync(join(contentDir, 'b.png'), 'foo');
    vi.stubEnv('GLOBALISE_CONTENT', contentDir);
  });

  it('serves an image with its type', async () => {
    const response = await getContentAsset('/assets/a/b%20c.png');
    expect(response?.headers.get('Content-Type')).toBe('image/png');
    expect(await response?.text()).toBe('foo');
  });

  it('skips a missing image', async () => {
    expect(await getContentAsset('/assets/a/c.png')).toBeUndefined();
  });

  it('skips files that are not images', async () => {
    expect(await getContentAsset('/assets/a/b.md')).toBeUndefined();
  });

  it('skips paths outside the assets', async () => {
    expect(await getContentAsset('/b.png')).toBeUndefined();
    expect(await getContentAsset('/assets/../b.png')).toBeUndefined();
  });
});
