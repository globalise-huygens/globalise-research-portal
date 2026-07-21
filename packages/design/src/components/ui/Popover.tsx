import { cn } from '../../lib';
import * as React from 'react';

export type PopoverProps = {
  variant?: 'default' | 'warning' | 'accent';
  size?: 'compact' | 'default' | 'wide';
  icon?: React.ReactNode;
  heading?: React.ReactNode;
  titleId?: string;
  footer?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>;

export function Popover({
  className,
  variant = 'default',
  size = 'default',
  icon,
  heading,
  titleId,
  footer,
  children,
  ...props
}: PopoverProps) {
  return (
    <div
      className={cn('popover', className)}
      data-size={size}
      data-variant={variant}
      {...props}
    >
      {(heading ?? icon) && (
        <div className="header">
          {icon && <span className="icon">{icon}</span>}
          {heading && <h2 id={titleId}>{heading}</h2>}
        </div>
      )}
      <div className="body">{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
}
