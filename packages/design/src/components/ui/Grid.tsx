import { cn } from '../../lib';
import * as React from 'react';

export type GridProps = {} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Shell grid primitive using the shared responsive contract:
 * 4 columns (mobile) → 8 (tablet) → 16 (desktop).
 */
const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('gds-grid', className)} {...props} />
  ),
);
Grid.displayName = 'Grid';

export { Grid };
