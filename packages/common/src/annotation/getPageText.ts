import { Id } from './Id';
import { orThrow } from '../util/orThrow';
import { Annotation } from './AnnoModel';
import { getBody } from './getBody';
import { assertTextualBody } from './assertTextualBody';

export function getPageText(annotations: Record<Id, Annotation>) {
  const htrPageAnno = findPageText(annotations)
    ?? orThrow('No htr transcription');
  const htrBody = getBody(htrPageAnno);
  assertTextualBody(htrBody);
  const text = htrBody.value;
  return { id: htrPageAnno.id, text };
}

export function findPageTextId(
  annotations: Record<Id, Annotation>,
): Id | undefined {
  return findPageText(annotations)?.id;
}

/**
 * Htr page transcription, when its annotation is loaded.
 */
export function findPageText(
  annotations: Record<Id, Annotation>,
): Annotation | undefined {
  return Object.values(annotations).find(
    (a) => a.textGranularity === 'page' && isHtrPage(a) && !!getBody(a),
  );
}

function isHtrPage(p: Annotation) {
  return p.id.includes('#page-htr');
}