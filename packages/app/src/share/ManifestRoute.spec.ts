import { describe, expect, it } from 'vitest';
import { parseManifestRoute } from './ManifestRoute';

const inventory = { inventory: '1053' };
const page = { inventory: '1053', page: '0004' };
const document = { inventory: '1053', page: '0003', endPage: '0071' };

describe(parseManifestRoute.name, () => {
  it('routes to an inventory', () => {
    expect(parseManifestRoute(inventory, {}).type).toBe('inventory');
  });

  it('routes to a scan', () => {
    expect(parseManifestRoute(page, {}).type).toBe('scan');
  });

  it('routes to a document', () => {
    expect(parseManifestRoute(document, { q: 'foo' }).type).toBe('document');
  });

  it('routes to a search hit by its snippet', () => {
    expect(parseManifestRoute(document, { snippet: 'foo' }).type).toBe('hit');
  });

  it('routes to a search hit by its index', () => {
    expect(parseManifestRoute(document, { 'hit-index': 0 }).type).toBe('hit');
  });

  it('ignores a search hit snippet on a scan', () => {
    expect(parseManifestRoute(page, { snippet: 'foo' }).type).toBe('scan');
  });
});
