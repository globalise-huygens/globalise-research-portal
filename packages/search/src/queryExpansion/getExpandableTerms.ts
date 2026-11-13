import type { TreeQuery } from '@knaw-huc/searchfield';
import { isAnnotationToken, toAnnotationType } from '../elasticsearch/annotationTypeFields';

// Collects the words in a query that the server expands. Field names, function names,
// annotation tokens and metadata field values are not search words, so they are skipped.
export default function getExpandableTerms(query: TreeQuery | null | undefined, terms = new Set<string>()): Set<string> {
  if (!query) {
    return terms;
  }

  switch (query.type) {
    case 'term':
      terms.add(query.value);
      break;
    case 'and':
    case 'or':
    case 'near':
      query.clauses.forEach((clause) => getExpandableTerms(clause, terms));
      break;
    case 'not':
      getExpandableTerms(query.clause, terms);
      break;
    case 'field':
      // Only 'person:adriaan' is expanded; not 'placeId:GLOB_574' or 'title:missive'
      if (!isAnnotationToken(query.field) && toAnnotationType(query.field)) {
        getExpandableTerms(query.clause, terms);
      }
      break;
    case 'containing':
    case 'notContaining':
      // Only 'containing(type:person, adriaan)' is expanded; not 'containing(title, missive)'
      if (query.container.type !== 'term') {
        getExpandableTerms(query.clause, terms);
      }
      break;
    case 'entity':
    case 'fuzzy':
    case 'phrase':
    case 'prefix-wildcard':
    case 'regex':
      break;
    default: {
      const unhandled: never = query;
      throw new Error(`Unsupported query: ${JSON.stringify(unhandled)}`);
    }
  }

  return terms;
}
