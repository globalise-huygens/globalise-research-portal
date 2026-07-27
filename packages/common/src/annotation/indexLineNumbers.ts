import { Annotation } from './AnnoModel';
import { Id } from './Id';

export function indexLineNumbers(
  annotations: Record<Id, Annotation>,
): Record<Id, number> {
  const lineNumberById: Record<Id, number> = {};
  let lineNumber = 0;

  for (const annotation of Object.values(annotations)) {
    if (annotation.textGranularity !== 'line') {
      continue;
    }
    lineNumber++;
    lineNumberById[annotation.id] = lineNumber;
  }

  return lineNumberById;
}
