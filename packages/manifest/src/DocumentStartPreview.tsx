import {
  useCallback, useContext, useEffect, useId, useRef, useState,
  type KeyboardEvent as ReactKeyboardEvent, type MouseEvent, type PointerEvent,
} from 'react';
import { Popover as OverlayPopover } from 'react-aria-components';
import { IconEntityDocument, Popover } from '@globalise/design';
import { navigateToc } from '@globalise/common/document';
import {
  formatDocumentScanSummary, type ManifestDocument,
} from '@globalise/metadata';
import './DocumentStartPreview.css';
import { ViewerDisplayContext } from './layout/ViewerDisplayContext';

type Props = {
  documents: ManifestDocument[];
  scanNumber: string;
  isCurrent: boolean;
};

export function DocumentStartPreview({ documents, scanNumber, isCurrent }: Props) {
  const [mode, setMode] = useState<'closed' | 'preview' | 'pinned'>('closed');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isRestoringFocus = useRef(false);
  const id = useId();
  const isOpen = mode !== 'closed';
  const documentCount = documents.length;
  const markerLabel = documentCount === 1
    ? 'Document start'
    : `${documentCount} document starts`;

  useEffect(() => () => clearTimeout(timer.current), []);

  function keepOpen() {
    clearTimeout(timer.current);
  }

  function preview() {
    keepOpen();
    setMode((current) => current === 'closed' ? 'preview' : current);
  }

  function scheduleClose() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const focusedElement = document.activeElement;
      const focusIsInPreview = cardRef.current?.contains(focusedElement);
      if (triggerRef.current === focusedElement || focusIsInPreview) {
        return;
      }
      setMode((current) => current === 'preview' ? 'closed' : current);
    }, 180);
  }

  const close = useCallback(() => {
    clearTimeout(timer.current);
    if (cardRef.current?.contains(document.activeElement)) {
      isRestoringFocus.current = true;
      triggerRef.current?.focus({ preventScroll: true });
      isRestoringFocus.current = false;
    }
    setMode('closed');
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // OpenSeadragon handles wheel scrolling without a DOM scroll event.
    // Dismiss instead of tracking the moving scan on every animation frame.
    const dismissOnWheel = (event: WheelEvent) => {
      const isInsidePreview = event.target instanceof Node
        && cardRef.current?.contains(event.target);
      if (!isInsidePreview) {
        close();
      }
    };
    // Handle reverse Tab before the portal's focus scope moves to the
    // element preceding the trigger. Here the expected destination is the trigger.
    const returnToTrigger = (event: KeyboardEvent) => {
      const firstAction = cardRef.current?.querySelector('.show-document');
      if (event.key === 'Tab' && event.shiftKey && event.target === firstAction) {
        event.preventDefault();
        event.stopPropagation();
        triggerRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('wheel', dismissOnWheel, {
      capture: true, passive: true,
    });
    window.addEventListener('keydown', returnToTrigger, true);
    return () => {
      document.removeEventListener('wheel', dismissOnWheel, true);
      window.removeEventListener('keydown', returnToTrigger, true);
    };
  }, [isOpen, close]);

  function schedulePreview(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === 'touch') {
      return;
    }
    keepOpen();
    timer.current = setTimeout(preview, 250);
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' || (event.key === 'Tab' && event.shiftKey)) {
      if (event.key === 'Escape') {
        event.preventDefault();
      }
      close();
      return;
    }
    if (event.key !== 'Tab' || !isOpen) {
      return;
    }
    const firstAction = cardRef.current?.querySelector<HTMLButtonElement>(
      '.show-document',
    );
    if (firstAction) {
      event.preventDefault();
      firstAction.focus();
    }
  }

  function togglePinned(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    keepOpen();
    setMode((current) => current === 'pinned' ? 'closed' : 'pinned');
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="canvas-label boundary"
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={`${markerLabel} at scan ${scanNumber}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? id : undefined}
        onPointerDown={(event) => event.stopPropagation()}
        onPointerEnter={schedulePreview}
        onPointerLeave={scheduleClose}
        onFocus={() => {
          if (!isRestoringFocus.current) {
            preview();
          }
        }}
        onBlur={scheduleClose}
        onKeyDown={handleTriggerKeyDown}
        onClick={togglePinned}
      >
        <IconEntityDocument aria-hidden="true" />
        <span className="label">{markerLabel}</span>
        <span className="short-label" aria-hidden="true">Start</span>
      </button>
      {isOpen && (
        <OverlayPopover
          ref={cardRef}
          triggerRef={triggerRef}
          isOpen
          isNonModal
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              close();
            }
          }}
          placement="bottom start"
          offset={6}
          containerPadding={8}
          className="document-start-popover"
          onPointerEnter={keepOpen}
          onPointerLeave={scheduleClose}
        >
          <CloseHiddenPreview onHide={close} />
          <Popover
            id={id}
            role="dialog"
            aria-label={`Documents starting at scan ${scanNumber}`}
            className="document-start-preview"
            onFocusCapture={keepOpen}
            onBlurCapture={scheduleClose}
            onWheel={(event) => event.stopPropagation()}
          >
            <ul>
              {documents.map((document) => (
                <li key={document.id}>
                  <h3>{document.label}</h3>
                  <p>{formatDocumentScanSummary(document.scans)}</p>
                  <button
                    type="button"
                    className="show-document"
                    aria-label={`Show ${document.label} in table of contents`}
                    onClick={() => {
                      close();
                      navigateToc('reveal', document.id);
                    }}
                  >
                    Show in table of contents
                  </button>
                </li>
              ))}
            </ul>
          </Popover>
        </OverlayPopover>
      )}
    </>
  );
}

// Subscribe only while the preview is open to keep closed markers CSS-driven.
function CloseHiddenPreview({ onHide }: { onHide: () => void }) {
  const { showDocumentStarts } = useContext(ViewerDisplayContext);
  useEffect(() => {
    if (!showDocumentStarts) {
      onHide();
    }
  }, [showDocumentStarts, onHide]);
  return null;
}
