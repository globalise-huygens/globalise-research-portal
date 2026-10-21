import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Popover as OverlayPopover } from 'react-aria-components';
import { IconEntityDocument, Popover } from '@globalise/design';
import { revealTocDocuments } from '@globalise/common/document';
import type { ManifestDocument } from '@globalise/metadata';
import './DocumentStartPreview.css';

type Props = {
  documents: ManifestDocument[];
  scanNumber: string;
  isCurrent: boolean;
};

/** A preview only: opening this card never selects a scan or loads document metadata. */
export function DocumentStartPreview({ documents, scanNumber, isCurrent }: Props) {
  const [mode, setMode] = useState<'closed' | 'preview' | 'pinned'>('closed');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isRestoringFocus = useRef(false);
  const id = useId();

  useEffect(() => () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  function keepOpen() {
    clearTimeout(closeTimer.current);
  }

  function preview() {
    keepOpen();
    setMode((current) => current === 'closed' ? 'preview' : current);
  }

  function scheduleClose() {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (triggerRef.current === document.activeElement || cardRef.current?.contains(document.activeElement)) {
        return;
      }
      setMode((current) => current === 'preview' ? 'closed' : current);
    }, 180);
  }

  const close = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    if (cardRef.current?.contains(document.activeElement)) {
      isRestoringFocus.current = true;
      triggerRef.current?.focus({ preventScroll: true });
      isRestoringFocus.current = false;
    }
    setMode('closed');
  }, []);

  useEffect(() => {
    if (mode === 'closed') {
      return;
    }
    // OpenSeadragon handles wheel scrolling without a DOM scroll event.
    // Dismiss instead of tracking the moving scan on every animation frame.
    const dismissOnWheel = (event: WheelEvent) => {
      if (event.target instanceof Node && !cardRef.current?.contains(event.target)) {
        close();
      }
    };
    // Handle reverse Tab before the portal's focus scope moves to the
    // element preceding the trigger. Here the expected destination is the trigger.
    const returnToTrigger = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && event.shiftKey
        && event.target === cardRef.current?.querySelector('.show-document')) {
        event.preventDefault();
        event.stopPropagation();
        triggerRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('wheel', dismissOnWheel, { capture: true, passive: true });
    window.addEventListener('keydown', returnToTrigger, true);
    return () => {
      document.removeEventListener('wheel', dismissOnWheel, true);
      window.removeEventListener('keydown', returnToTrigger, true);
    };
  }, [mode, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="canvas-label boundary"
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={`Preview ${documents.length === 1 ? 'new document' : `${documents.length} new documents`} at scan ${scanNumber}`}
        aria-haspopup="dialog"
        aria-expanded={mode !== 'closed'}
        aria-controls={mode !== 'closed' ? id : undefined}
        onPointerDown={(event) => event.stopPropagation()}
        onPointerEnter={(event) => {
          if (event.pointerType === 'touch') {
            return;
          }
          keepOpen();
          clearTimeout(openTimer.current);
          openTimer.current = setTimeout(preview, 250);
        }}
        onPointerLeave={scheduleClose}
        onFocus={() => {
          if (!isRestoringFocus.current) {
            preview();
          }
        }}
        onBlur={scheduleClose}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            close();
          }
          if (event.key === 'Tab' && event.shiftKey) {
            close();
          }
          if (event.key === 'Tab' && !event.shiftKey && mode !== 'closed') {
            const firstAction = cardRef.current?.querySelector<HTMLButtonElement>('button');
            if (firstAction) {
              event.preventDefault();
              firstAction.focus();
            }
          }
        }}
        onClick={(event) => {
          event.stopPropagation();
          clearTimeout(openTimer.current);
          keepOpen();
          setMode((current) => current === 'pinned' ? 'closed' : 'pinned');
        }}
      >
        <IconEntityDocument aria-hidden="true" />
        {documents.length > 1 && <span>{documents.length}</span>}
      </button>
      {mode !== 'closed' && (
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
                  <p>
                    {document.scans.length} scan{document.scans.length === 1 ? '' : 's'}
                    {document.scans.length === 1 ? (
                      <> · Scan {document.scans[0].scanNumber}</>
                    ) : (
                      <> · First scan {document.scans[0].scanNumber} · Last scan {document.scans.at(-1)!.scanNumber}</>
                    )}
                  </p>
                  <button
                    type="button"
                    className="show-document"
                    aria-label={`Show ${document.label} in table of contents`}
                    onClick={() => {
                      close();
                      revealTocDocuments([document.id]);
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
