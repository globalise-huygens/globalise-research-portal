import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LinkedArtNode } from '@globalise/common';
import { getPersonReferenceLinks, loadPersonReferences } from './PersonReferenceModel.ts';

vi.mock('../../../common/src/util/getSVGElement.ts', () => ({ getSVGElement: vi.fn() }));

const base = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/';
const person = (name: string): LinkedArtNode => ({
  type: 'Person', subject_of: [{
    id: `${base}person:${name}.annotations`, type: ['DigitalObject', 'AnnotationCollection'],
  }],
});
const annotation = (name: string, scan: string) => ({
  id: `${base}annotations:entities:${scan}#annotation:${name}`, type: 'Annotation',
  partOf: { id: `${base}canvas:${scan}`, type: 'Canvas',
    partOf: { id: `${base}inventory:2134.manifest`, type: 'Manifest' } },
});

afterEach(() => vi.unstubAllGlobals());

describe('person corpus references', () => {
  it('retries a failed collection when it is opened again', async () => {
    const entity = person('retry-collection');
    const fetch = vi.fn().mockRejectedValueOnce(new Error('Offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [annotation('retry', 'NL-HaNA_1.04.02_2134_0305')] })));
    vi.stubGlobal('fetch', fetch);
    expect(await loadPersonReferences(entity)).toEqual(getPersonReferenceLinks(entity));
    const items = await loadPersonReferences(entity);
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('NL-HaNA_1.04.02_2134_0305');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it('loads all pages, deduplicates mentions, and opens the exact scan in the existing viewer', async () => {
    const entity = person('paginated');
    const collectionUri = `${base}person:paginated.annotations`;
    const first = `${collectionUri}/page-1.json`;
    const second = `${collectionUri}/page-2.json`;
    const mention = annotation('371', 'NL-HaNA_1.04.02_2134_0305');
    const documents = new Map<string, unknown>([
      [`${collectionUri}.json`, { type: ['BasicContainer', 'AnnotationCollection'], first }],
      [first, { type: 'AnnotationPage', items: [mention], next: { id: second } }],
      [second, { type: 'AnnotationPage', items: [mention, annotation('372', 'NL-HaNA_1.04.02_2134_0306')] }],
    ]);
    const fetch = vi.fn((uri: string) => Promise.resolve(new Response(JSON.stringify(documents.get(uri)))));
    vi.stubGlobal('fetch', fetch);
    const items = await loadPersonReferences(entity);
    expect(items).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(items[0].uri).toBe(mention.id);
    expect(items[0].hrefType).toBe('internal');
    const target = new URL(items[0].href!, 'http://localhost');
    expect(target.pathname).toBe('/manifest');
    expect(target.searchParams.get('manifest')).toBe(`${base}inventory:2134.manifest.json`);
    expect(target.searchParams.get('canvas')).toBe(mention.partOf.id);
    expect(items[0].thumbnail).toBeUndefined();
    expect(items[0].hrefLabel).toContain('NL-HaNA_1.04.02_2134_0305');
    expect(items[0].copyLabel).toContain(mention.id);
  });

  it('retains the collection link if a page cannot be loaded', async () => {
    const entity = person('failed-page');
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ first: `${base}unavailable.json` })))
      .mockRejectedValueOnce(new Error('Unavailable')));
    expect(await loadPersonReferences(entity)).toEqual(getPersonReferenceLinks(entity));
  });

  it('stops cyclic pagination and retains a usable link', async () => {
    const entity = person('cyclic');
    const page = `${base}person:cyclic.annotations/page-1.json`;
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ first: page })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [], next: page })));
    vi.stubGlobal('fetch', fetch);
    expect(await loadPersonReferences(entity)).toEqual(getPersonReferenceLinks(entity));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('does not turn anonymous resources into links or fetch non-collection references', async () => {
    const entity: LinkedArtNode = { type: 'Person', subject_of: [
      { type: 'LinguisticObject', id: '_:b1' },
      { type: 'LinguisticObject', id: 'https://example.org/reference' },
    ] };
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(await loadPersonReferences(entity)).toHaveLength(1);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('recognizes a repeated page with and without the JSON suffix', async () => {
    const entity = person('normalized-cycle');
    const page = `${base}person:normalized-cycle.annotations/page-1`;
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ first: page })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [], next: `${page}.json` })));
    vi.stubGlobal('fetch', fetch);
    expect(await loadPersonReferences(entity)).toEqual(getPersonReferenceLinks(entity));
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
