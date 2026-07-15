import { Id } from './Id';
import { orThrow } from '../util/orThrow';
import { Annotation } from './AnnoModel';
import { getBody } from './getBody';
import { assertTextualBody } from './assertTextualBody';

export function getPageText(annotations: Record<Id, Annotation>) {
  return findPageText(annotations) ?? orThrow('No htr transcription');
}

export function findPageText(annotations: Record<Id, Annotation>) {
  const pageTexts = Object.values(annotations)
    .filter((a) => a.textGranularity === 'page' && getBody(a));
  const htrPageAnno = pageTexts.find(isHtrPage);
  if (!htrPageAnno) {
    return null;
  }
  const htrBody = getBody(htrPageAnno);
  assertTextualBody(htrBody);
  const text = htrBody.value;
  return { id: htrPageAnno.id, text };
}

function isHtrPage(p: Annotation) {
  return p.id.includes('#page-htr');
}
