import { parser } from './lucene/parser';
import parseQuery from './lucene/ast/parseQuery';
import { entityTokensToLabels } from './entityToken';

import type { Tree } from '@lezer/common';
import type { Query } from './SearchFieldConfig';

export default function getQuery(source: string, tree?: Tree, defaultOperator: 'and' | 'or' = 'and'): Query {
  return {
    source,
    lucene: entityTokensToLabels(source),
    query: parseQuery(source, tree ?? parser.parse(source), defaultOperator),
  };
}
