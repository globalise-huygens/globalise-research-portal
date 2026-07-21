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
  hasTopConcept?: ConceptRef[];

  /**
   * Relations:
   */
  broader?: ConceptRef[];
  narrower?: ConceptRef[];
  related?: ConceptRef[];

  /**
   * TODO: External relations
   * - relatedMatch
   * - closeMatch
   * - exactMatch
   */

  inScheme?: ConceptRef[];
  topConceptOf?: ConceptRef[];
};