import type { TreeQuery } from '@knaw-huc/searchfield';
import type { QueryDslQueryContainer } from '@elastic/elasticsearch/api/types';

export default function parseQuery(query: TreeQuery): QueryDslQueryContainer {
  switch (query.type) {
    case 'and':
      return {
        bool: {
          must: query.clauses.map((clause) => parseQuery(clause)),
        },
      };
    case 'or':
      return {
        bool: {
          should: query.clauses.map((clause) => parseQuery(clause)),
          minimum_should_match: 1,
        },
      };
    case 'not':
      return {
        bool: {
          must_not: [parseQuery(query.clause)],
        },
      };
    case 'term':
      return {
        match: {
          text: {
            query: query.value,
            boost: query.boost,
          },
        },
      };
    case 'phrase':
      return {
        match_phrase: {
          text: {
            query: query.value,
            slop: query.proximity,
            boost: query.boost,
          },
        },
      };
    case 'regex':
      return {
        regexp: {
          text: {
            value: query.value,
            boost: query.boost,
          },
        },
      };
    case 'prefix-wildcard':
      return {
        prefix: {
          text: {
            value: query.value,
            boost: query.boost,
          },
        },
      };
    case 'fuzzy':
      return {
        fuzzy: {
          text: {
            value: query.value,
            fuzziness: query.distance,
            boost: query.boost,
          },
        },
      };
    case 'entity':
      return {
        match: {
          text: {
            query: query.label,
          },
        },
      };
  }
}
