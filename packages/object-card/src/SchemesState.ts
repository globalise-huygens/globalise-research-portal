import { ConceptRef, LangValue } from './ObjectCardModel.ts';

export type SchemeBundle = {
  '@graph': SkosConcept[];
};

export type SchemesState = {
  schemes: SkosConcept[];
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export const emptySchemesState: SchemesState = {
  schemes: [],
  isLoading: false,
  isReady: false,
  error: null,
};

export type SkosConcept = {
  id: string;
  type: string;
  _label?: string;
  'dcterms:title'?: LangValue[];
  prefLabel?: LangValue[];
  altLabel?: LangValue[];
  definition?: LangValue[];
  hasTopConcept?: ConceptRef[];

  references?: LangValue;
  source?: LangValue;

  /**
   * Relations:
   */
  broader?: ConceptRef[];
  narrower?: ConceptRef[];
  related?: ConceptRef[];

  /**
   * External relations:
   */
  closeMatch?: string[];
  narrowMatch?: string[];
  exactMatch?: string[];

  inScheme?: ConceptRef[];
  topConceptOf?: ConceptRef[];
};