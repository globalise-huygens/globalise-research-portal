import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import type {Id} from '@knaw-huc/original-layout';
import {ViewFit} from '@knaw-huc/original-layout';
import {renderDiplomaticView} from './renderDiplomaticView';

import '@knaw-huc/original-layout/style.css';
import {Annotation} from '@globalise/common/annotation';
import {setHovered, toggleClicked} from '@globalise/common/document';
import { debounce } from 'lodash';

export type DiplomaticViewProps = {
  id?: string
  annotations: Record<Id, Annotation>;
  page: {width: number; height: number};
  fit?: ViewFit;
  showBlocks?: boolean;
  showScanMargin?: boolean;
  selected?: Id[];
  style?: React.CSSProperties;
};


export function DiplomaticView(props: DiplomaticViewProps) {
  const {
    annotations,
    page,
    fit,
    showBlocks,
    showScanMargin,
    selected = [],
    style,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<ReturnType<typeof renderDiplomaticView>>(null);
  const [width, setWidth] = useState(0);

  const setWidthDebounced = useMemo(
    () => debounce(setWidth, 50),
    []
  );

  useEffect(setWidthOnObservedResize, []);
  function setWidthOnObservedResize() {
    const $view = containerRef.current;
    if (!$view) {
      return;
    }
    const resizeObserver = new ResizeObserver(([viewEvent]) => {
      const observedWidth = viewEvent.contentRect.width;
      if (observedWidth !== width) {
        setWidthDebounced(observedWidth);
      }
    });
    resizeObserver.observe($view);
    return () => resizeObserver.disconnect();
  }

  useLayoutEffect(createDiplomaticView, [annotations, page, fit, showBlocks, width]);
  function createDiplomaticView() {
    const $view = containerRef.current;
    if (!$view || !width) {
      return;
    }
    $view.innerHTML = '';
    const view = renderDiplomaticView($view, annotations, {
      page,
      fit,
      showBlocks,
      showScanMargin,
      onHover: setHovered,
      onClick: toggleClicked,
    });
    view.setSelected(...selected);
    viewRef.current = view;
  }

  useEffect(() => {
    viewRef.current?.setSelected(...selected);
  }, [selected]);

  return <div ref={containerRef} style={style} />;
}