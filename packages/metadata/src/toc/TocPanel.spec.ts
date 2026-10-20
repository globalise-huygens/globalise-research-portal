import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TocPanel } from './TocPanel';
import type { ManifestDocument, ManifestScan } from './toToc';

const state = vi.hoisted(() => ({
  documents: [] as ManifestDocument[],
  scans: [] as ManifestScan[],
  selectedCanvasId: 'canvas-1',
}));

vi.mock('./useToc', () => ({
  useToc: () => state.documents,
  useManifestScans: () => state.scans,
}));
vi.mock('./useScrollToThumb.ts', () => ({
  useScrollToThumb: vi.fn(),
  scrollToTocElement: vi.fn(),
}));
vi.mock('@globalise/common/document', () => ({
  useSelectedCanvas: () => ({ id: state.selectedCanvasId }),
  useIsTocDocumentExpanded: () => false,
  expandTocDocument: vi.fn(),
  toggleTocDocument: vi.fn(),
  setSelectedCanvas: vi.fn(),
}));
vi.mock('./TocDocumentMetadata.tsx', () => ({ TocDocumentMetadata: () => null }));

function scan(scanNumber: number): ManifestScan {
  return { canvasId: `canvas-${scanNumber}`, scanNumber, width: 100, height: 200, pageMetadata: [] };
}

function render() {
  return renderToStaticMarkup(createElement(TocPanel));
}

describe('ToC scans outside documents', () => {
  beforeEach(() => {
    state.scans = [scan(1), scan(2), scan(3), scan(4)];
    state.documents = [{ id: 'document-1', label: 'A document', scans: [scan(2), scan(3)] }];
    state.selectedCanvasId = 'canvas-1';
  });

  it('enables scan navigation independently of document membership', () => {
    const markup = render();
    const buttons = markup.match(/<button[^>]*>/g) ?? [];
    const scanButton = buttons.find((button) => button.includes('aria-label="Go to current scan 1"'));
    expect(scanButton).toBeDefined();
    expect(scanButton).not.toContain('disabled');
    expect(buttons.find((button) => button.includes('aria-label="Go to current document"'))).toContain('disabled');
    expect(markup).toContain('class="toc-card" aria-current="true"');
  });

  it('places unassigned scans around document entries without duplicating assigned scans', () => {
    const markup = render();
    expect(markup.indexOf('Scan 1</span>')).toBeLessThan(markup.indexOf('A document'));
    expect(markup.indexOf('A document')).toBeLessThan(markup.indexOf('Scan 4</span>'));
    expect(markup).not.toContain('Scan 2</span>');
    expect(markup).not.toContain('Scan 3</span>');
  });

  it('still lists scans when the manifest has no document ranges', () => {
    state.documents = [];
    const markup = render();
    expect(markup).toContain('Scan 1</span>');
    expect(markup).toContain('Scan 4</span>');
    expect(markup).not.toContain('No table of contents');
  });
});
