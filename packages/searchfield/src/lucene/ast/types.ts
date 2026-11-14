export type SourceSpan = {
  from: number;
  to: number;
};

export type ASTBase = {
  span: SourceSpan;
  raw?: string;
  boost?: number;
};

export type TreeQuery =
    | BooleanQuery
    | NotQuery
    | TermQuery
    | PhraseQuery
    | RegexQuery
    | PrefixWildcardQuery
    | FuzzyQuery
    | EntityQuery
    | FieldQuery
    | ContainmentQuery
    | NearQuery;

export type BooleanQuery = {
  type: 'and' | 'or';
  clauses: TreeQuery[];
} & ASTBase;

export type NotQuery = {
  type: 'not';
  clause: TreeQuery;
} & ASTBase;

export type TermQuery = {
  type: 'term';
  value: string;
} & ASTBase;

export type PhraseQuery = {
  type: 'phrase';
  value: string;
  proximity?: number;
} & ASTBase;

export type RegexQuery = {
  type: 'regex';
  value: string;
} & ASTBase;

export type PrefixWildcardQuery = {
  type: 'prefix-wildcard';
  value: string;
} & ASTBase;

export type FuzzyQuery = {
  type: 'fuzzy';
  value: string;
  distance?: number;
} & ASTBase;

export type EntityQuery = {
  type: 'entity';
  entityType: string;
  id: string;
  label: string;
} & ASTBase;

export type FieldQuery = {
  type: 'field';
  field: string;
  clause: TreeQuery;
} & ASTBase;

export type ContainmentQuery = {
  type: 'containing' | 'notContaining';
  container: TreeQuery;
  clause: TreeQuery;
} & ASTBase;

export type NearQuery = {
  type: 'near';
  clauses: TreeQuery[];
  distance: number;
} & ASTBase;
