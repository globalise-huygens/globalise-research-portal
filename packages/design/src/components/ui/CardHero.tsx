import { cn } from '../../lib';
import * as React from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { IconArrowRight } from '../icons/IconArrowRight';

type CardHeroColor = 'turquoise' | 'vermilion' | 'mint' | 'parchment';

function cardHeroVariants({ className }: { className?: string } = {}) {
  return cn('gds-card-hero__hover', className);
}

type CardHeroBaseProps = {
  label: string;
  title: string;
  hoverColor?: CardHeroColor;
  className?: string;
  children?: React.ReactNode;
};

export type CardHeroProps =
  | (CardHeroBaseProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'color'
  >)
  | (CardHeroBaseProps & { href?: never } & Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'color'
  >);

const CardHero = React.forwardRef<HTMLElement, CardHeroProps>((props, ref) => {
  const { className, hoverColor, label, title, children } = props;
  const href = 'href' in props ? props.href : undefined;
  const [touched, setTouched] = React.useState(false);
  const sharedClassName = cn('gds-card-hero', className);

  const handleTouchStart = () => setTouched(true);
  const handleTouchEnd = () => setTouched(false);

  const content = (
    <>
      <div
        className="gds-card-hero__media"
        data-hidden={touched ? 'true' : undefined}
      >
        {children}
      </div>

      <div
        className={cardHeroVariants()}
        data-color={hoverColor ?? 'turquoise'}
        data-visible={touched ? 'true' : undefined}
      >
        <div className="gds-card-hero__copy">
          <span className="gds-card-hero__label">{label}</span>
          <span className="gds-card-hero__title">{title}</span>
        </div>
        <IconArrowRight className="gds-card-hero__icon" aria-hidden="true" />
      </div>
    </>
  );

  if (href) {
    return (
      <AriaLink
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={sharedClassName}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {content}
      </AriaLink>
    );
  }

  return (
    <AriaButton
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={sharedClassName}
      data-clickable="true"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {content}
    </AriaButton>
  );
});
CardHero.displayName = 'CardHero';

export { CardHero, cardHeroVariants };
