import {
  type Annotation,
  type EntityBody,
  type EventBody,
  isEntity,
  isEvent,
} from '@globalise/common/annotation';
import {
  type DocumentState,
  getHoverDelay,
  getHoverElement,
  removeHoverAttribute,
  type Selection,
  setHovered,
  useDocumentStore,
} from '@globalise/common/document';
import { PreviewCard } from '@globalise/design';
import { useEffect, useRef, useState } from 'react';
import './ManifestClassifiedPreview.css';
import { getEntityPreviewData } from './getEntityPreviewData';
import { getEventPreviewData } from './getEventPreviewData';

export function ManifestClassifiedPreview() {
  const isOpen = useRef(false);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const hovered = useDocumentStore((s) => s.hovered);
  const canvases = useDocumentStore((s) => s.canvases);

  useEffect(updatePreview, [hovered, canvases, preview]);

  function updatePreview() {
    const anchor = hovered ? getHoverElement() : null;
    const annotation = getHoveredAnnotation(canvases, hovered);
    if (!annotation || !anchor) {
      if (preview?.isHovered) {
        setPreview({ ...preview, isHovered: false });
      }
      return;
    }
    const openImmediately = isOpen.current
      || getHoverDelay(anchor) === 'immediate';
    const isHovered = true;
    const next: PreviewState = { annotation, anchor, isHovered, openImmediately };
    const isCurrentlyShown = preview?.annotation === next.annotation
      && preview.anchor === next.anchor
      && preview.isHovered;
    if (!isCurrentlyShown) {
      setPreview(next);
    }
  }

  if (!preview) {
    return null;
  }

  const { annotation, anchor } = preview;

  function handleOpenChange(open: boolean) {
    isOpen.current = open;
    if (!open) {
      removeHoverAttribute(anchor);
      setPreview(null);
      setHovered(null);
    } else if (hovered?.id !== annotation.id) {
      setHovered(annotation.id);
    }
  }

  return <PreviewCard
    key={annotation.id}
    data={getPreviewData(annotation)}
    anchor={anchor}
    isHovered={preview.isHovered}
    openImmediately={preview.openImmediately}
    onOpenChange={handleOpenChange}
  />;
}

type ClassifiedAnnotation = Annotation<EntityBody> | Annotation<EventBody>;

type PreviewState = {
  annotation: ClassifiedAnnotation;
  anchor: Element;
  isHovered: boolean;
  openImmediately: boolean;
};

function getPreviewData(annotation: ClassifiedAnnotation) {
  return isEvent(annotation)
    ? getEventPreviewData(annotation)
    : getEntityPreviewData(annotation);
}

function getHoveredAnnotation(
  canvases: DocumentState['canvases'],
  hovered: Selection | null,
): ClassifiedAnnotation | null {
  if (hovered?.type !== 'classified') {
    return null;
  }
  for (const { annotations } of Object.values(canvases)) {
    const annotation = annotations?.[hovered.id];
    if (annotation) {
      return isEntity(annotation) || isEvent(annotation) ? annotation : null;
    }
  }
  return null;
}
