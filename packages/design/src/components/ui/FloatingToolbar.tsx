import { cn } from '../../lib';
import * as React from 'react';

export type FloatingToolbarProps = {
  align?: 'start' | 'end';
} & React.HTMLAttributes<HTMLDivElement>;

export function FloatingToolbar({
  align = 'start',
  className,
  role = 'toolbar',
  ...props
}: FloatingToolbarProps) {
  return (
    <div
      className={cn('floating-toolbar', className)}
      data-align={align}
      role={role}
      {...props}
    />
  );
}
