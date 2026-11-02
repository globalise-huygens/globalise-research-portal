import { describe, expect, it } from 'vitest';
import { findCurrentDocument } from './tocEntries';
import type { ManifestDocument, ManifestScan } from './toToc';

function scan(scanNumber: number): ManifestScan {
  return { canvasId: `canvas-${scanNumber}`, scanNumber, width: 100, height: 200, pageMetadata: [] };
}

const scans = [scan(1), scan(2), scan(3), scan(4)];
const document: ManifestDocument = { id: 'document-1', label: 'A document', scans: [scans[1], scans[2]] };

describe('table of contents entries', () => {
  it('finds the preferred document only when it contains the current scan', () => {
    const overlapping = { ...document, id: 'document-2', scans: [scans[2]] };
    expect(findCurrentDocument([document, overlapping], scans[2].canvasId, overlapping.id)).toBe(overlapping);
    expect(findCurrentDocument([document, overlapping], scans[1].canvasId, overlapping.id)).toBe(document);
    expect(findCurrentDocument([document], scans[0].canvasId)).toBeUndefined();
  });
});
