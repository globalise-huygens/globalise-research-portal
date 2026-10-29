import { useRef } from 'react';
import { useMove } from 'react-aria';

type Props = {
  controls: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const minSwipeDistance = 24;

export function ScanNavigationHandle({ controls, isOpen, onOpenChange }: Props) {
  const swipedY = useRef(0);
  const hasSwiped = useRef(false);

  const { moveProps } = useMove({
    onMoveStart: () => {
      swipedY.current = 0;
    },
    onMove: ({ deltaY }) => {
      swipedY.current += deltaY;
    },
    onMoveEnd: () => {
      hasSwiped.current = Math.abs(swipedY.current) >= minSwipeDistance;
      if (hasSwiped.current) {
        onOpenChange(swipedY.current < 0);
      }
    },
  });

  return <button type="button" className="scan-navigation-handle"
    aria-label="Scan navigation" aria-expanded={isOpen} aria-controls={controls}
    {...moveProps}
    onClick={() => {
      if (!hasSwiped.current) {
        onOpenChange(!isOpen);
      }
      hasSwiped.current = false;
    }}
    onKeyDown={(event) => {
      if (!['ArrowUp', 'ArrowDown', 'Escape'].includes(event.key)) {
        return;
      }
      event.preventDefault();
      onOpenChange(event.key === 'ArrowUp');
    }}>
    <span aria-hidden="true" />
  </button>;
}
