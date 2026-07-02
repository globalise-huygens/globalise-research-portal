import { cn } from '../../lib';
import * as React from 'react';
import { Link as AriaLink } from 'react-aria-components';
import { Button } from './Button';

type CardGlanceColor = 'turquoise' | 'vermilion' | 'mint' | 'parchment';

function cardGlanceVariants({ className }: { className?: string } = {}) {
  return cn('gds-card-glance', className);
}

type CardGlanceBaseProps = {
  heading: string;
  subtitle: string;
  description: string;
  cta: string;
  color?: CardGlanceColor;
  className?: string;
};

export type CardGlanceProps =
  | (CardGlanceBaseProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'color'
  >)
  | (CardGlanceBaseProps & { href?: never } & Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'color'
  >);

const CardGlance = React.forwardRef<HTMLElement, CardGlanceProps>(
  (props, ref) => {
    const { className, color, heading, subtitle, description, cta, ...rest } =
      props;
    const href = 'href' in props ? props.href : undefined;
    const content = (
      <>
        <div className="gds-card-glance__header">
          <span className="gds-card-glance__heading">{heading}</span>
          <span className="gds-card-glance__subtitle">{subtitle}</span>
        </div>
        <div className="gds-card-glance__body">
          <span className="gds-card-glance__description">{description}</span>
        </div>
        <div className="gds-card-glance__footer">
          <Button variant="link" as="span" className="gds-card-glance__cta">
            {cta}
          </Button>
        </div>
      </>
    );

    if (href) {
      return (
        <AriaLink
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cardGlanceVariants({ className })}
          data-color={color ?? 'turquoise'}
        >
          {content}
        </AriaLink>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cardGlanceVariants({ className })}
        data-color={color ?? 'turquoise'}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {content}
      </div>
    );
  },
);
CardGlance.displayName = 'CardGlance';

export { CardGlance, cardGlanceVariants };
