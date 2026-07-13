import './Splitter.css';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import * as React from 'react';
import { Direction } from './useLayoutDirection';

type SplitterProps = React.HTMLAttributes<HTMLDivElement> & {
  onDoubleClick?: () => void;
  direction?: Direction;
  isDragging?: boolean;
  paneRatio: number;
};

export function Splitter({
  onDoubleClick,
  direction,
  isDragging,
  paneRatio,
  className,
  onPointerDown,
  ...props
}: SplitterProps) {
  const classNames = ['splitter', direction, className];

  if (isDragging) {
    classNames.push('active');
  }

  return (
    <div
      role="separator"
      aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-valuemax={80}
      aria-valuemin={20}
      aria-valuenow={Math.round(paneRatio * 100)}
      className={classNames.join(' ')}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      {...props}
      tabIndex={0}
    >
      <div className="splitter-grip">
        <DragIndicatorIcon className="grip-icon" />
      </div>
    </div>
  );
}
