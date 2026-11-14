import type { EntityTagType, LinkedArtEntityType } from '@globalise/common';
import type {
  CidocEntityClassificationId,
} from '@globalise/common/annotation';
import type { CanvasId } from '@globalise/common/document';

export type LinkedEntity = {
  id: string;
  type: LinkedArtEntityType;
  label: string;
  mentions: Mention[];
};

export type NerCategoryGroup = {
  id: string;
  label: string;
  tagType: EntityTagType;
  nerCategories: NerCategory[];
};

export type NerCategory = {
  id: CidocEntityClassificationId;
  label: string;
  total: number;
};

export type Mention = {
  annotationId: string;
  canvasId: CanvasId;
};
