import { cn } from '@/lib/utils';
import * as React from 'react';

export type DocumentDetailReferenceCardProps = {
  isSelected?: boolean;
  thumbnail?: React.ReactNode;
  heading: React.ReactNode;
  meta?: React.ReactNode;
  snippet?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const DocumentDetailReferenceCard = React.forwardRef<
  HTMLDivElement,
  DocumentDetailReferenceCardProps
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
      className={cn('gds-document-detail-reference-card', className)}
      {...props}
    >
      <div className="gds-document-detail-reference-card__layout">
        {thumbnail && (
          <div className="gds-document-detail-reference-card__thumbnail">
            {thumbnail}
          </div>
        )}

        <div className="gds-document-detail-reference-card__body">
          <div className="gds-document-detail-reference-card__header">
            <div className="gds-document-detail-reference-card__heading">
              {heading}
            </div>
            {actions}
          </div>

          {snippet && (
            <div className="gds-document-detail-reference-card__snippet">
              {snippet}
            </div>
          )}

          {meta && (
            <div className="gds-document-detail-reference-card__meta">
              {meta}
            </div>
          )}
          {footer && (
            <div className="gds-document-detail-reference-card__footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  ),
);
DocumentDetailReferenceCard.displayName = 'DocumentDetailReferenceCard';

export { DocumentDetailReferenceCard };
