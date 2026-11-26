import { describe, expect, it } from 'vitest';
import { handle } from './uriPatterns.ts';
import { createViewerPath, parseViewerSplat } from './viewerPath';

const inventoryPath = `/${handle}/inventory:1053`;
const pagePath = `${inventoryPath}/0004`;
const documentPath = `${inventoryPath}/0003-0067`;

const inventorySplat = '1053';
const pageSplat = `${inventorySplat}/0004`;
const documentSplat = `${inventorySplat}/0003-0067`;

const inventoryRef = { inventory: '1053' };
const pageRef = { inventory: '1053', page: '0004' };
const documentRef = { inventory: '1053', page: '0003', endPage: '0067' };

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

describe(parseViewerSplat.name, () => {
  it('reads the inventory of an inventory splat', () => {
    expect(parseViewerSplat(inventorySplat)).toEqual(inventoryRef);
  });

  it('reads the inventory and page of a scan splat', () => {
    expect(parseViewerSplat(pageSplat)).toEqual(pageRef);
  });

  it('reads the inventory and page range of a document splat', () => {
    expect(parseViewerSplat(documentSplat)).toEqual(documentRef);
  });

  it('ignores other splats', () => {
    expect(parseViewerSplat('manifest')).toBeNull();
  });
});
