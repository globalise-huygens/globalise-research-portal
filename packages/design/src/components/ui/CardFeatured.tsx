import { cn } from '../../lib';
import * as React from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { IconArrowRight } from '../icons/IconArrowRight';
import { IconShowMore } from '../icons/IconShowMore';

export type CardFeaturedItem = {
  color: string;
  /** Short category label (e.g. "Collection"), will be displayed above the title */
  label: string;
  /** Title text — supports newlines via \n */
  title: string;
  /** Call-to-action link text */
  cta: string;
  /** URL the expanded card links to */
  href?: string;
  /** Optional background image for the expanded state */
  image?: React.ReactNode;
  /** When true, text on the expanded card will be white (for image/dark backgrounds) */
  darkBackground?: boolean;
};

export type CardFeaturedProps = {
  /** Array of featured items to display */
  items: CardFeaturedItem[];
  /** Which item is expanded by default (index) */
  defaultExpanded?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const CardFeatured = React.forwardRef<HTMLDivElement, CardFeaturedProps>(
  ({ className, items, defaultExpanded = 0, ...props }, ref) => {
    const [expandedIndex, setExpandedIndex] = React.useState(defaultExpanded);

    return (
      <div ref={ref} className={cn('gds-card-featured', className)} {...props}>
        {items.map((item, index) => {
          const isExpanded = index === expandedIndex;

          if (isExpanded) {
            const expandedContent = (
              <>
                {/* Background: image or solid color */}
                {item.image ? (
                  <>
                    {item.image}
                    <div className="gds-card-featured__overlay" />
                  </>
                ) : (
                  <div
                    className="gds-card-featured__solid"
                    style={{ backgroundColor: item.color }}
                  />
                )}

                {/* Content */}
                <div className="gds-card-featured__content">
                  <div className="gds-card-featured__copy">
                    <span
                      className="gds-card-featured__label"
                      data-on-dark={item.darkBackground ? 'true' : undefined}
                    >
                      {item.label}
                    </span>
                    <span
                      className="gds-card-featured__title"
                      data-on-dark={item.darkBackground ? 'true' : undefined}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span
                    className="gds-card-featured__cta"
                    data-on-dark={item.darkBackground ? 'true' : undefined}
                  >
                    {item.cta}{' '}
                    <IconArrowRight
                      className="gds-card-featured__cta-icon"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </>
            );

            if (item.href) {
              return (
                <AriaLink
                  key={index}
                  href={item.href}
                  className="gds-card-featured__expanded"
                >
                  {expandedContent}
                </AriaLink>
              );
            }

            return (
              <div key={index} className="gds-card-featured__expanded">
                {expandedContent}
              </div>
            );
          }

          return (
            <AriaButton
              key={index}
              className="gds-card-featured__collapsed"
              style={{ backgroundColor: item.color }}
              onPress={() => setExpandedIndex(index)}
              aria-label={`Expand ${item.label}: ${item.title.replace(/\n/g, ' ')}`}
            >
              <IconShowMore
                className="gds-card-featured__collapsed-icon"
                aria-hidden="true"
              />
              <span className="gds-card-featured__collapsed-title">
                {item.title.replace(/\n/g, ' ')}
              </span>
            </AriaButton>
          );
        })}
      </div>
    );
  },
);
CardFeatured.displayName = 'CardFeatured';

export { CardFeatured };
