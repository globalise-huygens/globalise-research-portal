import { cn } from '@/lib/utils';
import * as React from 'react';
import { Separator as AriaSeparator } from 'react-aria-components';

export type ArticleRowProps = {} & React.HTMLAttributes<HTMLDivElement>;

const ArticleRow = React.forwardRef<HTMLDivElement, ArticleRowProps>(
  ({ className, children, ...props }, ref) => {
    const items = React.Children.toArray(children);
    return (
      <div ref={ref} className={cn('gds-article-row', className)} {...props}>
        {items.map((child, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <AriaSeparator
                orientation="vertical"
                className="gds-article-row__separator"
              />
            )}
            <div className="gds-article-row__item">{child}</div>
          </React.Fragment>
        ))}
      </div>
    );
  },
);
ArticleRow.displayName = 'ArticleRow';

export { ArticleRow };
