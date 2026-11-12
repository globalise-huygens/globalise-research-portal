import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { copyContentAssets } from './copyContentAssets.ts';

describe('copyContentAssets', () => {
  let contentDir: string;
  let outputDir: string;

  beforeEach(() => {
    contentDir = mkdtempSync(join(tmpdir(), 'content-'));
    outputDir = mkdtempSync(join(tmpdir(), 'output-'));
  });

  it('copies the assets into the output', async () => {
    mkdirSync(join(contentDir, 'assets/a'), { recursive: true });
    writeFileSync(join(contentDir, 'assets/a/b.png'), 'foo');
    await copyContentAssets(contentDir, outputDir);
    expect(existsSync(join(outputDir, 'assets/a/b.png'))).toBe(true);
  });

  it('skips content without assets', async () => {
    await copyContentAssets(contentDir, outputDir);
    expect(existsSync(join(outputDir, 'assets'))).toBe(false);
  });
});
