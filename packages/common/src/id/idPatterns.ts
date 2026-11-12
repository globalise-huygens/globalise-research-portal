export const idPatterns = {
  manifest: /^https:\/\/[^/]+\/hdl:20\.500\.14722\/inventory:(?<inventory>[0-9A-Z]+)\.manifest$/u,
  canvas: /^https:\/\/[^/]+\/hdl:20\.500\.14722\/canvas:NL-HaNA_1\.04\.02_(?<inventory>[0-9A-Z]+)_(?<page>[0-9A-Z]+)$/u,
  document: /^https:\/\/[^/]+\/hdl:20\.500\.14722\/document:NL-HaNA_1\.04\.02_(?<inventory>[0-9A-Z]+)_(?<startPage>[0-9A-Z]+)-(?<endPage>[0-9A-Z]+)$/u,
  annotation: /^https:\/\/[^/]+\/hdl:20\.500\.14722\/annotations:[a-z]+:NL-HaNA_1\.04\.02_(?<inventory>[0-9A-Z]+)_(?<page>[0-9A-Z]+)#(?<fragment>.+)$/u,
};
