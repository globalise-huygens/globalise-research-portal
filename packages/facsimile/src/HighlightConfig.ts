import {
  type Annotation,
  type CidocEntityClassificationId,
  findSvgPath,
  findTextualBodyValue,
  type Id,
  isBlock,
  isWord,
  parseSvgPath,
} from '@globalise/common/annotation';
import { orThrow } from '@globalise/common';

export type WordHighlightConfig = {
  id: Id;
  path: string;
  text: string;
  entityClassificationId?: CidocEntityClassificationId;
};

export type BlockHighlightConfig = {
  id: Id;
  path: string;
};

export function toWordHighlightConfigs(
  annotations: Record<Id, Annotation>,
  entityClassificationByWord: Partial<Record<Id, CidocEntityClassificationId>>,
): WordHighlightConfig[] {
  return Object.values(annotations)
    .filter(isWord)
    .map((a) => ({
      id: a.id,
      path: toPath(a),
      text: findTextualBodyValue(a) ?? orThrow('No body value'),
      entityClassificationId: entityClassificationByWord[a.id],
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
