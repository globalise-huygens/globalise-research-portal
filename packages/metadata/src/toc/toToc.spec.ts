// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import type { Vault } from '@iiif/helpers/vault';
import { toToc } from './toToc';

const canvas = (id: string) => ({ id, type: 'Canvas' });
const canvasRef = (id: string) => ({
  type: 'SpecificResource',
  source: { id, type: 'Canvas' },
});
const range = (id: string) => ({ id, type: 'Range' });

function createVault(nodes: Record<string, unknown>): Vault {
  return {
    get: (ref: { id: string }) => nodes[ref.id],
  } as unknown as Vault;
}

describe(toToc.name, () => {
  const vault = createVault({
    'manifest': {
      items: [canvas('c1'), canvas('c2'), canvas('c3')],
      structures: [range('toc')],
    },
    'c1': canvas('c1'),
    'c2': canvas('c2'),
    'c3': canvas('c3'),
    'toc': {
      id: 'toc',
      label: { en: ['Table of Contents'] },
      items: [range('doc-0'), range('doc-1')],
    },
    'doc-0': {
      id: 'doc-0',
      label: { en: ['Document 3c0ca24d'] },
      items: [canvasRef('c1'), canvasRef('c3')],
    },
    'doc-1': {
      id: 'doc-1',
      label: { en: ['Document f52feb58'] },
      items: [],
    },
  });

  it('maps documents with their scan numbers in manifest order', () => {
    const [first, second] = toToc(vault, 'manifest');

    expect(first.label).toBe('Document 3c0ca24d');
    expect(first.scans).toEqual([
      { canvasId: 'c1', scanNumber: 1, thumbnailUrl: undefined },
      { canvasId: 'c3', scanNumber: 3, thumbnailUrl: undefined },
    ]);
    expect(second.scans).toEqual([]);
  });
});