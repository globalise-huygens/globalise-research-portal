import './SplitPaneLayout.css';
import React, { ReactNode, useRef } from 'react';
import { resetScaling, usePaneRatio } from '../SettingsStore';
import { Splitter } from './Splitter';
import { useLayoutDirection } from './useLayoutDirection';
import { usePaneResize } from './usePaneResize';

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
  const panes = React.Children.toArray(children);
  const dividerSize =
    direction === 'horizontal'
      ? splitterThickness.horizontalLayout
      : splitterThickness.verticalLayout;
  const {
    handleKeyDown,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging,
    liveRatio,
    resetDragRatio,
  } = usePaneResize({ containerRef, direction, dividerSize, paneRatio });

  const splitTemplate =
    `calc((100% - ${dividerSize}px) * ${liveRatio}) ` +
    `${dividerSize}px minmax(0, 1fr)`;

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
        paneRatio={liveRatio}
        onDoubleClick={() => {
          resetScaling();
          resetDragRatio(0.5);
        }}
        onKeyDown={handleKeyDown}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      <div className="split-pane-layout__pane">{panes[1]}</div>
    </div>
  );
}
