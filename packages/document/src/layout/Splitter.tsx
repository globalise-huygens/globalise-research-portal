import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DividerProps } from 'react-split-pane';
import { Direction } from './useLayoutDirection';

import './Splitter.css';

type SplitterProps = DividerProps & {
  onDoubleClick?: () => void;
  direction?: Direction;
};

export function Splitter(
  {
    onDoubleClick,
    direction,
    isDragging,
    className,
    ...props
  }: SplitterProps,
) {
  const classNames = [
    'splitter',
    direction,
    className,
  ];

  if (isDragging) {
    classNames.push('active');
  }

  const {
    currentSize: _currentSize,
    minSize: _minSize,
    maxSize: _maxSize,
    ...divProps
  } = props;

  return (
    <div
      className={classNames.join(' ')}
      onDoubleClick={onDoubleClick}
      {...divProps}
    >
      <div className="splitter-grip">
        <DragIndicatorIcon className="grip-icon"/>
      </div>
    </div>
  );
}