import { describe, expect, it } from 'vitest';
import { createViewerPath, parseViewerPath } from './viewerPath';

const inventoryPath = '/hdl:20.500.14722/inventory:1053';
const pagePath = `${inventoryPath}/0004`;
const documentPath = `${inventoryPath}/0003-0067`;

const inventoryRef = { inventory: '1053' };
const pageRef = { inventory: '1053', page: '0004' };
const documentRef = { inventory: '1053', startPage: '0003', endPage: '0067' };

describe(createViewerPath.name, () => {
  it('builds the path of an inventory', () => {
    expect(createViewerPath(inventoryRef)).toBe(inventoryPath);
  });

  it('adds the page of a scan', () => {
    expect(createViewerPath(pageRef)).toBe(pagePath);
  });

  it('adds the page range of a document', () => {
    expect(createViewerPath(documentRef)).toBe(documentPath);
  });
});

describe(parseViewerPath.name, () => {
  it('reads the inventory of an inventory path', () => {
    expect(parseViewerPath(inventoryPath)).toEqual(inventoryRef);
  });

  it('reads the inventory and page of a scan path', () => {
    expect(parseViewerPath(pagePath)).toEqual(pageRef);
  });

  it('reads the inventory and page range of a document path', () => {
    expect(parseViewerPath(documentPath)).toEqual(documentRef);
  });

  it('ignores other paths', () => {
    expect(parseViewerPath('/manifest')).toBeUndefined();
  });
});
