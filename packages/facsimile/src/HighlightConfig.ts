import {
  type Annotation,
  findSvgPath,
  findTextualBodyValue,
  type Id,
  isBlock,
  isWord,
  parseSvgPath,
} from '@globalise/common/annotation';
import { orThrow } from '@globalise/common';
import type { WordClassifications } from '@globalise/common/document';

export type WordHighlightConfig = WordClassifications & {
  id: Id;
  path: string;
  text: string;
};

export type BlockHighlightConfig = {
  id: Id;
  path: string;
};

export function toWordHighlightConfigs(
  annotations: Record<Id, Annotation>,
  classificationsByWord: Partial<Record<Id, WordClassifications>>,
): WordHighlightConfig[] {
  return Object.values(annotations)
    .filter(isWord)
    .map((a) => ({
      id: a.id,
      path: toPath(a),
      text: findTextualBodyValue(a) ?? orThrow('No body value'),
      ...classificationsByWord[a.id],
    }));
}

export function toBlockHighlightConfigs(
  annotations: Record<Id, Annotation>,
): BlockHighlightConfig[] {
  return Object.values(annotations)
    .filter(isBlock)
    .map((a) => ({ id: a.id, path: toPath(a) }));
}

function toPath(annotation: Annotation): string {
  return parseSvgPath(findSvgPath(annotation) ?? orThrow('No svg path'));
}
