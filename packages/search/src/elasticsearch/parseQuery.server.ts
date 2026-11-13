import type { TreeQuery } from '@knaw-huc/searchfield';
import type { QueryDslIntervalsContainer, QueryDslQueryContainer } from '@elastic/elasticsearch/api/types';
import { isAnnotationToken, toAnnotationType } from './annotationTypeFields';

export default function parseQuery(query: TreeQuery, queryExpansions?: Record<string, string[]>, field = 'annotatedText'): QueryDslQueryContainer {
  switch (query.type) {
    case 'and':
      return {
        bool: {
          must: query.clauses.map((clause) => parseQuery(clause, queryExpansions, field)),
        },
      };
    case 'or':
      return {
        bool: {
          should: query.clauses.map((clause) => parseQuery(clause, queryExpansions, field)),
          minimum_should_match: 1,
        },
      };
    case 'not':
      return {
        bool: {
          must_not: [parseQuery(query.clause, queryExpansions, field)],
        },
      };
    case 'term':
      if (queryExpansions?.[query.value]) {
        return {
          bool: {
            should: [
              { match: { [field]: { query: query.value } } },
              // 'match_phrase' is used because the analyser may split an expansion into several tokens.
              // For example, 'schip' is expanded into 'Na-schip', which 'match' would turn into 'na OR schip'.
              // This causes 'na' to also be highlighted.
              ...queryExpansions[query.value].map((expansion) => ({ match_phrase: { [field]: { query: expansion } } })),
            ],
            minimum_should_match: 1,
            boost: query.boost,
          },
        };
      } else {
        return {
          match: {
            [field]: {
              query: query.value,
              boost: query.boost,
            },
          },
        };
      }

    case 'phrase':
      return {
        match_phrase: {
          [field]: {
            query: query.value,
            slop: query.proximity,
            boost: query.boost,
          },
        },
      };
    case 'regex':
      return {
        regexp: {
          [field]: {
            value: query.value,
            boost: query.boost,
          },
        },
      };
    case 'prefix-wildcard':
      return {
        prefix: {
          [field]: {
            value: query.value,
            boost: query.boost,
          },
        },
      };
    case 'fuzzy':
      return {
        fuzzy: {
          [field]: {
            value: query.value,
            fuzziness: query.distance,
            boost: query.boost,
          },
        },
      };
    case 'entity':
      return {
        match: {
          annotatedText: {
            query: query.label,
          },
        },
      };
      // A 'field' is used when the user searches from something like 'placeId:GLOB_574', 'person:adriaan' or 'title:missive'
    case 'field':
      // This runs when a user searches for something like 'placeId:GLOB_574'. It only returns documents containing that placeId.
      if (isAnnotationToken(query.field)) {
        return {
          term: {
            annotatedText: {
              value: toAnnotationToken(query.field, query.clause),
              boost: query.boost,
            },
          },
        };
      }
      // This runs when a user searches for something like 'person:adriaan'.
      // It returns all documents in which there is the word 'adriaan' inside a Person annotation.
      if (toAnnotationType(query.field)) {
        return {
          intervals: {
            annotatedText: { ...toInterval(query, queryExpansions), boost: query.boost },
          },
        };
      }
      // This runs for all other cases, e.g., 'title:missive'. This is default ES syntax to search through keyword fields.
      return parseQuery(query.clause, undefined, query.field);
    case 'containing':
    case 'notContaining':
      // Runs when the first param is a bare word, e.g., 'containing(title,missive)'
      if (query.container.type === 'term') {
        const inField = parseQuery(query.clause, undefined, query.container.value);
        return query.type === 'containing' ? inField : { bool: { must_not: [inField] } };
      }
      // Runs when the first param is an annotation type, e.g., 'containing(type:person,adriaan)'
      return {
        intervals: {
          annotatedText: { ...toInterval(query, queryExpansions), boost: query.boost },
        },
      };
    case 'near':
      return {
        intervals: {
          [field]: { ...toInterval(query, queryExpansions), boost: query.boost },
        },
      };
    default:
    {
      const unhandled: never = query;
      throw new Error(`Unsupported query: ${JSON.stringify(unhandled)}`);
    }

  }
}

export function toInterval(query: TreeQuery, queryExpansions?: Record<string, string[]>): QueryDslIntervalsContainer {
  switch (query.type) {
    case 'term':
      if (queryExpansions?.[query.value]) {
        return {
          any_of: {
            intervals: [
              { match: { query: query.value } },
              // 'match_phrase' does not exist on intervals, so by using max_gaps: 0 and ordered: true,
              // the functionality is simulated. The 'Na-schip' example from above will be searched for like,
              // 'na' directly followed by 'schip'.
              ...queryExpansions[query.value].map((expansion) => ({ match: { query: expansion, max_gaps: 0, ordered: true } })),
            ],
          },
        };
      } else {
        return { match: { query: query.value } };
      }
    case 'phrase':
      return {
        match: {
          query: query.value,
          max_gaps: query.proximity ?? 0,
          ordered: query.proximity === undefined,
        },
      };
    case 'prefix-wildcard':
      return { prefix: { prefix: query.value } };
    case 'fuzzy':
      return { fuzzy: { term: query.value, fuzziness: query.distance ?? 'AUTO' } };
    case 'regex':
      return { regexp: { pattern: query.value } };
    case 'or':
      return { any_of: { intervals: query.clauses.map((clause) => toInterval(clause, queryExpansions)) } };
    case 'and':
      return { all_of: { intervals: query.clauses.map((clause) => toInterval(clause, queryExpansions)), ordered: false } };
    case 'near':
      return {
        all_of: {
          intervals: (query.clauses as readonly TreeQuery[]).map((clause) => toInterval(clause, queryExpansions)),
          max_gaps: query.distance,
          ordered: false,
        },
      };
    case 'field': {
      if (isAnnotationToken(query.field)) {
        return { match: { query: toAnnotationToken(query.field, query.clause), analyzer: 'keyword' } };
      }
      const annotationType = toAnnotationType(query.field);
      if (annotationType) {
        const container = { match: { query: `type:${annotationType}`, analyzer: 'keyword' } };
        return toContainedInterval(query.clause, container, true, queryExpansions);
      }
      throw new Error(`Field '${query.field}' is not supported inside near()`);
    }
    case 'containing':
    case 'notContaining':
      if (query.container.type === 'term') {
        throw new Error(`Metadata field '${query.container.value}' is not supported inside near()`);
      }
      return toContainedInterval(query.clause, toInterval(query.container), query.type === 'containing', queryExpansions);
    case 'not':
    case 'entity':
      throw new Error(`'${query.type}' is not supported inside near()`);
    default: {
      const unhandled: never = query;
      throw new Error(`Unsupported query: ${JSON.stringify(unhandled)}`);
    }
  }
}

function toAnnotationToken(field: string, clause: TreeQuery): string {
  if (clause.type !== 'term' && clause.type !== 'phrase') {
    throw new Error(`'${field}' only accepts a single value, got '${clause.type}'`);
  }
  if (field !== 'type') {
    return `${field}:${clause.value}`;
  }
  const annotationType = toAnnotationType(clause.value);
  if (!annotationType) {
    throw new Error(`Unsupported annotation type '${clause.value}'`);
  }
  return `type:${annotationType}`;
}

function toContainedInterval(
  clause: TreeQuery,
  container: QueryDslIntervalsContainer,
  contained: boolean,
  queryExpansions: Record<string, string[]> | undefined,
): QueryDslIntervalsContainer {
  return {
    all_of: {
      intervals: [toInterval(clause, queryExpansions)],
      filter: contained ? { overlapping: container } : { not_overlapping: container },
    },
  };
}
