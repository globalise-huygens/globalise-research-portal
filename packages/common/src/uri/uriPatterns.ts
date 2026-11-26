// future: https://id.globalise.nl/hdl:20.500.14722
export const handle = 'hdl:20.500.14722';
export const idBase = `https://data.globalise.huygens.knaw.nl/${handle}`;
export const thesaurusBase = `${idBase}/thesaurus:`;


export function matchUri<T extends keyof UriGroups>(
  type: T,
  uri: string,
): Groups<T> | undefined {
  return uriPatterns[type].exec(uri)?.groups as Groups<T> | undefined;
}

type Groups<T extends keyof UriGroups> = Record<UriGroups[T], string>;

type UriGroups = {
  internal: 'host' | 'path';
  manifest: 'inventory';
  canvas: 'inventory' | 'page';
  document: 'inventory' | 'page' | 'endPage';
  annotation: 'inventory' | 'page' | 'fragment';
  objectCard: 'type' | 'id';
  viewerSplat: 'inventory' | 'page' | 'endPage';
  objectCardSplat: 'type' | 'id';
};

const uriPatterns = {
  internal: /^https:\/\/(?<host>data\.globalise\.huygens\.knaw\.nl|id\.globalise\.nl)\/hdl:20\.500\.14722\/(?<path>.*)$/u,
  manifest: /^https:\/\/[^/]+\/hdl:20\.500\.14722\/inventory:(?<inventory>[0-9A-Z]+)\.manifest$/u,
  canvas: /^https:\/\/[^/]+\/hdl:20\.500\.14722\/canvas:NL-HaNA_1\.04\.02_(?<inventory>[0-9A-Z]+)_(?<page>[0-9A-Z]+)$/u,
  document: /^https:\/\/[^/]+\/hdl:20\.500\.14722\/document:NL-HaNA_1\.04\.02_(?<inventory>[0-9A-Z]+)_(?<page>[0-9A-Z]+)-(?<endPage>[0-9A-Z]+)$/u,
  annotation: /^https:\/\/[^/]+\/hdl:20\.500\.14722\/annotations:[a-z]+:NL-HaNA_1\.04\.02_(?<inventory>[0-9A-Z]+)_(?<page>[0-9A-Z]+)#(?<fragment>.+)$/u,
  objectCard: /^https:\/\/(?:data\.globalise\.huygens\.knaw\.nl|id\.globalise\.nl)\/hdl:20\.500\.14722\/(?<type>[a-z]+):(?<id>.+)$/u,
  viewerSplat: /^(?<inventory>[0-9A-Z]+)(?:\/(?<page>[0-9A-Z]+)(?:-(?<endPage>[0-9A-Z]+))?)?$/u,
  objectCardSplat: /^(?<type>[a-z]+):(?<id>.+)$/u,
};
