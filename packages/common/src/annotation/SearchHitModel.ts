import { Annotation, Body } from './AnnoModel.ts';
import { getBody } from './getBody.ts';

export type SearchHitBody = {
  type: 'SearchHit';
  esHitIndex: number;
};

export const isSearchHitBody = (
  body: Body | undefined,
): body is SearchHitBody => (body as SearchHitBody | undefined)?.type === 'SearchHit';

export const isSearchHit = (
  annotation: Annotation,
): annotation is Annotation<SearchHitBody> => isSearchHitBody(getBody(annotation));
