import type { StyleSpec } from 'style-mod';
import type { EntityToken } from './entityToken';
import type { TreeQuery } from './lucene/ast/types';

type SearchFieldConfig<E extends object> = {
  query: string;
  enableHistory: boolean;
  enableLuceneQuerySyntax: boolean;
  defaultOperator: 'and' | 'or';
  onSearch?: (query: Query) => void;
  onUpdate?: (state: UpdateState) => void;
  theme?: {
    light?: ThemeConfig;
    dark?: ThemeConfig;
  };
  autocomplete?: AutocompleteConfig<E>;
};
export default SearchFieldConfig;

export type Query = {
  source: string;
  lucene: string;
  query: TreeQuery | null;
};

export type UpdateState = {
  canUndo: boolean;
  canRedo: boolean;
};

export type ThemeConfig = {
  fontFamily?: string;
  fontFamilyAutocomplete?: string;
  entity?: { className?: string, style?: StyleSpec };
  icon?: { className?: string, style?: StyleSpec };
  cross?: { className?: string, style?: StyleSpec };
  highlight?: HighlightConfig;
};

export type HighlightConfig = {
  string?: string;
  operatorKeyword?: string;
  number?: string;
  modifier?: string;
  regexp?: string;
  escape?: string;
  paren?: string;
  function?: string;
  field?: string;
  separator?: string;
};

export type AutocompleteConfig<E extends object> = {
  source: (query: string) => Promise<E[]>;
  minimumChars?: number;
  debounceMs?: number;
  id: keyof E | ((entity: E) => string);
  type: keyof E | ((entity: E) => string);
  label: keyof E | ((entity: E) => string);
  description: keyof E | ((entity: E) => string);
  icon?: (entity: E) => SVGElement | undefined | null;
  token?: {
    color?: (entityToken: EntityToken) => string | undefined | null;
    icon?: (entityToken: EntityToken) => SVGElement | undefined | null;
  };
};
