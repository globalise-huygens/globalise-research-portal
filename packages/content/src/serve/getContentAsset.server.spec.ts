import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getContentAsset } from './getContentAsset.server.ts';

describe('getContentAsset', () => {
  beforeEach(() => {
    const contentDir = mkdtempSync(join(tmpdir(), 'content-'));
    mkdirSync(join(contentDir, 'assets/images'), { recursive: true });
    writeFileSync(join(contentDir, 'assets/images/old map.png'), 'map');
    writeFileSync(join(contentDir, 'assets/images/README.md'), 'readme');
    writeFileSync(join(contentDir, 'secret.png'), 'secret');
    vi.stubEnv('GLOBALISE_CONTENT', contentDir);
  });

  it('serves an image with its type', async () => {
    const response = await getContentAsset('/assets/images/old%20map.png');
    expect(response?.headers.get('Content-Type')).toBe('image/png');
    expect(await response?.text()).toBe('map');
  });

  it('skips a missing image', async () => {
    expect(await getContentAsset('/assets/images/missing.png')).toBeUndefined();
  });

  it('skips files that are not images', async () => {
    expect(await getContentAsset('/assets/images/README.md')).toBeUndefined();
  });

  it('skips paths outside the assets', async () => {
    expect(await getContentAsset('/secret.png')).toBeUndefined();
    expect(await getContentAsset('/assets/../secret.png')).toBeUndefined();
  });
});
