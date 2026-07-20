export type LangValue = {
  '@language': string;
  '@value': string;
};

export type ConceptRef = {
  id: string;
  type: string;
  _label?: string;
  prefLabel?: LangValue[];
};

export type SkosConcept = {
  id: string;
  type: string;
  _label?: string;
  'dcterms:title'?: LangValue[];
  prefLabel?: LangValue[];
  altLabel?: LangValue[];
  hasTopConcept?: ConceptRef[];
  broader?: ConceptRef[];
  narrower?: ConceptRef[];
};

export function conceptLabel(concept: ConceptRef): string {
  if (concept._label) {
    return concept._label;
  }
  const first = concept.prefLabel?.[0];
  return first ? first['@value'] : concept.id;
}