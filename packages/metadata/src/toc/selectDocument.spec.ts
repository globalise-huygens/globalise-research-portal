import { describe, expect, it } from 'vitest';
import { selectDocument } from './selectDocument';
import type { ManifestDocument, ManifestScan } from './toToc';

function scan(scanNumber: number): ManifestScan {
  return { canvasId: `canvas-${scanNumber}`, scanNumber, width: 100, height: 200, pageMetadata: [] };
}

const scans = [scan(1), scan(2), scan(3)];
const first: ManifestDocument = { id: 'document-1', label: 'First', scans: [scans[0], scans[1]] };
const second: ManifestDocument = { id: 'document-2', label: 'Second', scans: [scans[1], scans[2]] };
const documents = [first, second];

describe(selectDocument.name, () => {
  it('stays in the selected document when it contains the scan', () => {
    expect(selectDocument(documents, scans[1].canvasId, second.id)).toBe(second);
  });

  it('picks the first document with the scan when the selected document does not contain it', () => {
    expect(selectDocument(documents, scans[0].canvasId, second.id)).toBe(first);
  });

  it('picks the first document with the scan without a selected document', () => {
    expect(selectDocument(documents, scans[1].canvasId, null)).toBe(first);
  });

  it('finds no document for a scan outside all documents', () => {
    expect(selectDocument(documents, 'canvas-4', null)).toBeUndefined();
  });
});
