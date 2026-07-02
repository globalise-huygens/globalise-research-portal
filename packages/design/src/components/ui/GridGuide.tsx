import { getShellGridModel, useShellColumnCount } from '../../lib';
import { cn } from '../../lib';
import * as React from 'react';

export type GridGuideProps = {
  /** Whether the guide overlay is visible */
  visible?: boolean;
  /** Whether column overlays are visible */
  showGrid?: boolean;
  /** Whether horizontal 8px rhythm lines are visible */
  showRhythm?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A fixed 16-column overlay that visualises the page grid.
 * Toggle visibility to check component alignment against the
 * shared 1440 px layout contract.
 *
 * Renders at a fixed position spanning the full viewport height.
 * Each column is tinted so you can see how content aligns.
 */
const GridGuide = React.forwardRef<HTMLDivElement, GridGuideProps>(
  (
    {
      className,
      visible = false,
      showGrid = true,
      showRhythm = false,
      ...props
    },
    ref,
  ) => {
    const columnCount = useShellColumnCount({ enabled: visible });
    const contentBand = React.useMemo(
      () => getShellGridModel(columnCount),
      [columnCount],
    );

    if (!visible) {return null;}

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('gds-grid-guide', className)}
        {...props}
      >
        {showRhythm && (
          <div
            className="gds-grid-guide__rhythm"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, transparent 1px, transparent 8px)',
            }}
          />
        )}

        {showGrid &&
          Array.from({ length: columnCount }).map((_, i) => (
            <div
              key={i}
              className="gds-grid-guide__column"
              data-outside={
                i + 1 < contentBand.start || i + 1 > contentBand.end
                  ? 'true'
                  : undefined
              }
            />
          ))}
      </div>
    );
  },
);
GridGuide.displayName = 'GridGuide';

export { GridGuide };
