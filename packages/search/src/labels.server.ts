const url = 'https://objectstore.surf.nl/87435b768620494e8e911c83d1997f24:globalise-data/objects/inventory/facets.json';
const facets: Record<string, Map<string, string[]>> = {};

export function getLabels(facet: string) {
  if (!facets[facet]) {
    throw new Error(`No labels found for facet ${facet}!`);
  }
  return facets[facet];
}

export function getLabel(facet: string, identifier: string) {
  return getLabels(facet).get(identifier) ?? [];
}

type Facet = {
  facet: string;
  identifier: string;
  title: string[];
  path?: string;
  parents: string[];
};

async function obtainFacets() {
  Object.keys(facets).forEach((key) => delete facets[key]);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json() as Facet[];
  for (const facet of data) {
    if (!(facet.facet in facets)) {
      facets[facet.facet] = new Map();
    }

    facets[facet.facet].set(facet.identifier, facet.title);
  }
}

await obtainFacets();
