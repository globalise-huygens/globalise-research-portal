import './Splitter.css';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import * as React from 'react';
import { Direction } from './useLayoutDirection';

type SplitterProps = React.HTMLAttributes<HTMLDivElement> & {
  onDoubleClick?: () => void;
  direction?: Direction;
  isDragging?: boolean;
};

export function Splitter({
  onDoubleClick,
  direction,
  isDragging,
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
      className={classNames.join(' ')}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      {...props}
    >
      <div className="splitter-grip">
        <DragIndicatorIcon className="grip-icon" />
      </div>
    </div>
  );
}
