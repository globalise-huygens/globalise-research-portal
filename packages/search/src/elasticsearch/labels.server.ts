/*
TODO: To be replaced by a query call to SQLite

globalise.db-> select * from facet_value_titles;
╭──┬────────────────────────────────────┬───────────────────────────────────────────────────────────────╮
│id│              value_id              │                             title                             │
╞══╪════════════════════════════════════╪═══════════════════════════════════════════════════════════════╡
│ 1│aa001d1b-3f4c-5458-8b54-efec2acfd468│Deel II/E                                                      │
├──┼────────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 2│aa001d1b-3f4c-5458-8b54-efec2acfd468│INGEKOMEN STUKKEN VAN GOUVERNEUR-GENERAAL EN RADEN BIJ DE HEREN│
│  │                                    │XVII EN DE KAMER ZEELAND                                       │
╰──┴────────────────────────────────────┴───────────────────────────────────────────────────────────────╯
 */

const url = 'https://objectstore.surf.nl/87435b768620494e8e911c83d1997f24:globalise-data/objects/inventory/facets.json';
// const facets: Map<string, string[]> = Record<string, Facet> = {};
let facets = new Map<string, string[]>();

// type Facet = {
//   info: FacetInfo;
//   labels: Map<string, string[]>;
// };

type FacetInfo = {
  id: string;
  label: {
    en: string;
    nl: string;
  }
};

type FacetData = {
  facet: FacetInfo;
  identifier: string;
  title: string[];
  path?: string;
  parents: string[];
};

// export function getInfo(facet: string) {
//   if (!facets[facet]) {
//     throw new Error(`No info found for facet ${facet}!`);
//   }
//   return facets[facet].info;
// }

// export function getLabels(facet: string) {
//   if (!facets[facet]) {
//     throw new Error(`No labels found for facet ${facet}!`);
//   }
//   return facets[facet]?.labels;
// }

export function getLabel(facet: string, identifier: string) {
  // return getLabels(facet).get(identifier) ?? [];
  return facets.get(identifier) ?? [];
}

async function obtainFacets() {
  // Object.keys(facets).forEach((key) => delete facets[key]);
  facets = new Map<string, string[]>();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json() as FacetData[];
  for (const facet of data) {
    // if (!(facet.facet.id in facets)) {
    //   facets[facet.facet.id] = { info: facet.facet, labels: new Map() };
    // }

    // facets[facet.facet.id].labels.set(facet.identifier, facet.title);
    facets.set(facet.identifier, facet.title);
  }
}

await obtainFacets();
