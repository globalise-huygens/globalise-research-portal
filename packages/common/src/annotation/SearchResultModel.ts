import { Annotation, Body } from './AnnoModel.ts';
import { getBody } from './getBody.ts';

export type SearchResultBody = {
  type: 'search-result';
  id: string;
};

export const isSearchResultAnnotationBody = (
  body: Body | undefined,
): body is SearchResultBody =>
  (body as SearchResultBody)?.type === 'search-result';

export const isSearchResultAnnotation = (
  annotation: Annotation,
): annotation is Annotation<SearchResultBody> =>
  isSearchResultAnnotationBody(getBody(annotation));
