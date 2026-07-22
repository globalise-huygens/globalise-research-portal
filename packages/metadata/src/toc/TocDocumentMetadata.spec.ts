import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { TocDocumentMetadata } from './TocDocumentMetadata';
import type { ManifestDocument } from './toToc';

vi.mock('@globalise/common', () => ({
  label: () => '',
  loadMetadata: vi.fn(),
  url: () => undefined,
  useMetadata: () => ({ isLoading: false }),
  useMetadataNodes: () => [],
  useMetadataValues: () => [],
}));

const document: ManifestDocument = {
  id: 'document-1',
  label: 'Document 1',
  scans: [],
};

describe(TocDocumentMetadata.name, () => {
  it('hides metadata fields without values', () => {
    const markup = renderToStaticMarkup(
      createElement(TocDocumentMetadata, { document }),
    );

    expect(markup).toBe('<dl class="toc-document-metadata"></dl>');
  });

  it('renders TANAP metadata when present', () => {
    const markup = renderToStaticMarkup(
      createElement(TocDocumentMetadata, {
        document: { ...document, tanapId: 'TANAP-123' },
      }),
    );

    expect(markup).toContain('<dt>TANAP</dt><dd>TANAP-123</dd>');
  });
});
