import { cn } from '../../lib';
import * as React from 'react';
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components';

type DividerColor = 'light' | 'dark';

function dividerVariants({ className }: { className?: string } = {}) {
  return cn('gds-divider', className);
}

export type DividerProps = {
  className?: string;
  color?: DividerColor;
  orientation?: AriaSeparatorProps['orientation'];
} & Omit<
  AriaSeparatorProps,
  'className' | 'style' | 'orientation'
>;

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation = 'horizontal', color, ...props }, ref) => (
    <AriaSeparator
      ref={ref}
      orientation={orientation ?? 'horizontal'}
      className={dividerVariants({ className })}
      data-color={color ?? 'light'}
      data-orientation={orientation ?? 'horizontal'}
      {...props}
    />
  ),
);
Divider.displayName = 'Divider';

export { Divider, dividerVariants };
