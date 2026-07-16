import { cn } from '../../../lib';
import * as React from 'react';

export type ViewerReferenceCardProps = {
  isSelected?: boolean;
  thumbnail?: React.ReactNode;
  heading: React.ReactNode;
  meta?: React.ReactNode;
  snippet?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const ViewerReferenceCard = React.forwardRef<
  HTMLDivElement,
  ViewerReferenceCardProps
>(
  (
    {
      className,
      isSelected = false,
      thumbnail,
      heading,
      meta,
      snippet,
      actions,
      footer,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      aria-current={isSelected ? 'true' : undefined}
      className={cn('viewer-reference-card', className)}
      {...props}
    >
      <div data-slot="layout">
        {thumbnail && (
          <div data-slot="thumbnail">
            {thumbnail}
          </div>
        )}

        <div data-slot="body">
          <div data-slot="header">
            <div data-slot="heading">
              {heading}
            </div>
            {actions}
          </div>

          {snippet && (
            <div data-slot="snippet">
              {snippet}
            </div>
          )}

          {meta && (
            <div data-slot="meta">
              {meta}
            </div>
          )}
          {footer && (
            <div data-slot="footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  ),
);
ViewerReferenceCard.displayName = 'ViewerReferenceCard';

export { ViewerReferenceCard };
