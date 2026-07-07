import './SplitPaneLayout.css';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { resetScaling, setPaneRatio, usePaneRatio } from '../SettingsStore';
import { Splitter } from './Splitter';
import { useLayoutDirection } from './useLayoutDirection';

type DocumentLayoutProps = {
  children: [ReactNode, ReactNode];
};

const splitterThickness = {
  horizontalLayout: 10,
  verticalLayout: 16,
};
export const layoutBreakpoint = 1024;

export function SplitPaneLayout({ children }: DocumentLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const direction = useLayoutDirection(layoutBreakpoint);
  const paneRatio = usePaneRatio();
  const [isDragging, setIsDragging] = useState(false);
  const panes = React.Children.toArray(children);
  const dividerSize =
    direction === 'horizontal'
      ? splitterThickness.horizontalLayout
      : splitterThickness.verticalLayout;
  const minRatio = 0.2;
  const clampRatio = useCallback(
    (ratio: number) => Math.min(Math.max(ratio, minRatio), 1 - minRatio),
    [],
  );
  const [liveRatio, setLiveRatio] = useState(() => clampRatio(paneRatio));
  const pendingRatioRef = useRef(liveRatio);

  useEffect(() => {
    if (!isDragging) {
      const next = clampRatio(paneRatio);
      pendingRatioRef.current = next;
      setLiveRatio(next);
    }
  }, [paneRatio, isDragging, clampRatio]);

  const updatePaneRatio = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const offset =
        direction === 'horizontal' ? clientX - rect.left : clientY - rect.top;
      const availableSize =
        direction === 'horizontal' ? rect.width : rect.height;
      if (!availableSize) {
        return;
      }
      const nextRatio = Math.min(
        Math.max(offset / availableSize, minRatio),
        1 - minRatio,
      );

      pendingRatioRef.current = nextRatio;
      setLiveRatio(nextRatio);
    },
    [direction],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const target = event.currentTarget;
      setIsDragging(true);
      target.setPointerCapture(event.pointerId);

      const handleMove = (moveEvent: PointerEvent) => {
        updatePaneRatio(moveEvent.clientX, moveEvent.clientY);
      };

      const handleUp = () => {
        setIsDragging(false);
        setPaneRatio(pendingRatioRef.current);
        if (target.hasPointerCapture(event.pointerId)) {
          target.releasePointerCapture(event.pointerId);
        }
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
      updatePaneRatio(event.clientX, event.clientY);
    },
    [updatePaneRatio],
  );

  const splitTemplate =
    direction === 'horizontal'
      ? `calc((100% - ${dividerSize}px) * ${liveRatio}) ${dividerSize}px minmax(0, 1fr)`
      : `minmax(0, 1fr) ${dividerSize}px calc((100% - ${dividerSize}px) * ${liveRatio})`;

  return (
    <div
      ref={containerRef}
      className="split-pane-layout"
      data-direction={direction}
      style={{
        gridTemplateColumns:
          direction === 'horizontal' ? splitTemplate : undefined,
        gridTemplateRows: direction === 'vertical' ? splitTemplate : undefined,
      }}
    >
      <div className="split-pane-layout__pane">{panes[0]}</div>
      <Splitter
        direction={direction}
        isDragging={isDragging}
        onDoubleClick={() => {
          resetScaling();
          pendingRatioRef.current = 0.5;
          setLiveRatio(0.5);
        }}
        onPointerDown={handlePointerDown}
      />
      <div className="split-pane-layout__pane">{panes[1]}</div>
    </div>
  );
}
