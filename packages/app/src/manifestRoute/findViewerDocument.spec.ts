import { describe, expect, it } from 'vitest';
import { findViewerDocument } from './findViewerDocument';

const document = { inventory: '1053', page: '0003', endPage: '0071' };

describe(findViewerDocument.name, () => {
  it('views the selected document while on its first page', () => {
    const firstPage = { inventory: '1053', page: '0003' };
    expect(findViewerDocument(firstPage, document)).toBe(document);
  });

  it('views the page once scrolled to another page', () => {
    const otherPage = { inventory: '1053', page: '0004' };
    expect(findViewerDocument(otherPage, document)).toBe(otherPage);
  });

  it('views the page of another inventory', () => {
    const otherInventory = { inventory: '1171A', page: '0003' };
    expect(findViewerDocument(otherInventory, document)).toBe(otherInventory);
  });

  it('views the page without a selected document', () => {
    const page = { inventory: '1053', page: '0003' };
    expect(findViewerDocument(page, undefined)).toBe(page);
  });
});
