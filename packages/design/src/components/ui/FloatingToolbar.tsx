import { cn } from '../../lib';
import * as React from 'react';

export type FloatingToolbarProps = {
  align?: 'start' | 'end';
} & React.HTMLAttributes<HTMLDivElement>;

export function FloatingToolbar({
  align = 'start',
  className,
  ...props
}: FloatingToolbarProps) {
  return (
    <div
      className={cn('floating-toolbar', className)}
      data-align={align}
      {...props}
    />
  );
}
