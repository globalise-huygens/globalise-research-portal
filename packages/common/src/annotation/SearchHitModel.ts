import { Annotation, Body, TextualBody } from './AnnoModel.ts';
import { getBody } from './getBody.ts';
import { isTextualBody } from './isTextualBody.ts';

export type SearchHitBody = TextualBody & {
  value: 'search-hit';
  purpose: 'tagging';
};

export const searchHitBody: SearchHitBody = {
  type: 'TextualBody',
  value: 'search-hit',
  purpose: 'tagging',
};

export const isSearchHitBody = (
  body: Body | undefined,
): body is SearchHitBody => isTextualBody(body)
  && body.value === searchHitBody.value
  && body.purpose === searchHitBody.purpose;

export const isSearchHit = (
  annotation: Annotation,
): annotation is Annotation<SearchHitBody> => isSearchHitBody(getBody(annotation));
