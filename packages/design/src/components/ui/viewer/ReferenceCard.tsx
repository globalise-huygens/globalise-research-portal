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
} & React.HTMLAttributes<HTMLButtonElement>;

const ViewerReferenceCard = React.forwardRef<
  HTMLButtonElement,
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
    <button
      type="button"
      ref={ref}
      aria-current={isSelected ? 'true' : undefined}
      className={cn('viewer-reference-card', className)}
      {...props}
    >
      <div className="layout">
        {thumbnail && (
          <div className="thumbnail">
            {thumbnail}
          </div>
        )}

        <div className="body">
          <div className="header">
            <div className="heading">
              {heading}
            </div>
            {actions}
          </div>

          {snippet && (
            <div className="snippet">
              {snippet}
            </div>
          )}

          {meta && (
            <div className="meta">
              {meta}
            </div>
          )}
          {footer && (
            <div className="footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </button>
  ),
);
ViewerReferenceCard.displayName = 'ViewerReferenceCard';

export { ViewerReferenceCard };
