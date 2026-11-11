import type { TreeQuery } from '@knaw-huc/searchfield';
import type { QueryDslIntervalsContainer, QueryDslQueryContainer } from '@elastic/elasticsearch/api/types';
import { annotationTypeFields } from './annotationTypeFields';

// The keys of annotation tokens. An annotation is indexed as `key:value` tokens inside annotatedText,
// not as separate fields, so `placeId:GLOB_574` is looked up as one exact token.
const annotationTokenKeys = ['type', 'personId', 'placeId'];

export default function parseQuery(query: TreeQuery, field = 'annotatedText'): QueryDslQueryContainer {
  switch (query.type) {
    case 'and':
      return {
        bool: {
          must: query.clauses.map((clause) => parseQuery(clause, field)),
        },
      };
    case 'or':
      return {
        bool: {
          should: query.clauses.map((clause) => parseQuery(clause, field)),
          minimum_should_match: 1,
        },
      };
    case 'not':
      return {
        bool: {
          must_not: [parseQuery(query.clause, field)],
        },
      };
    case 'term':
      return {
        match: {
          [field]: {
            query: query.value,
            boost: query.boost,
          },
        },
      };
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
      if (annotationTokenKeys.includes(query.field)) {
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
            annotatedText: { ...toInterval(query), boost: query.boost },
          },
        };
      }
      // This runs for all other cases, e.g., 'title:missive'. This is default ES syntax to search through keyword fields.
      return parseQuery(query.clause, query.field);
    case 'containing':
    case 'notContaining':
      // Runs when the first param is a bare word, e.g., 'containing(title,missive)'
      if (query.container.type === 'term') {
        const inField = parseQuery(query.clause, query.container.value);
        return query.type === 'containing' ? inField : { bool: { must_not: [inField] } };
      }
      // Runs when the first param is an annotation type, e.g., 'containing(type:person,adriaan)'
      return {
        intervals: {
          annotatedText: { ...toInterval(query), boost: query.boost },
        },
      };
    case 'near':
      return {
        intervals: {
          [field]: { ...toInterval(query), boost: query.boost },
        },
      };
    default:
    {
      const unhandled: never = query;
      throw new Error(`Unsupported query: ${JSON.stringify(unhandled)}`);
    }

  }
}

export function toInterval(query: TreeQuery): QueryDslIntervalsContainer {
  switch (query.type) {
    case 'term':
      return { match: { query: query.value } };
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
      return { any_of: { intervals: query.clauses.map(toInterval) } };
    case 'and':
      return { all_of: { intervals: query.clauses.map(toInterval), ordered: false } };
    case 'near':
      return {
        all_of: {
          intervals: (query.clauses as readonly TreeQuery[]).map(toInterval),
          max_gaps: query.distance,
          ordered: false,
        },
      };
    case 'field': {
      if (annotationTokenKeys.includes(query.field)) {
        return { match: { query: toAnnotationToken(query.field, query.clause), analyzer: 'keyword' } };
      }
      const annotationType = toAnnotationType(query.field);
      if (annotationType) {
        const container = { match: { query: `type:${annotationType}`, analyzer: 'keyword' } };
        return toContainedInterval(query.clause, container, true);
      }
      throw new Error(`Field '${query.field}' is not supported inside near()`);
    }
    case 'containing':
    case 'notContaining':
      if (query.container.type === 'term') {
        throw new Error(`Metadata field '${query.container.value}' is not supported inside near()`);
      }
      return toContainedInterval(query.clause, toInterval(query.container), query.type === 'containing');
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

function toAnnotationType(name: string): string | undefined {
  const key = name.toLowerCase();
  return Object.hasOwn(annotationTypeFields, key) ? annotationTypeFields[key] : undefined;
}

function toContainedInterval(
  clause: TreeQuery,
  container: QueryDslIntervalsContainer,
  contained: boolean,
): QueryDslIntervalsContainer {
  return {
    all_of: {
      intervals: [toInterval(clause)],
      filter: contained ? { overlapping: container } : { not_overlapping: container },
    },
  };
}
