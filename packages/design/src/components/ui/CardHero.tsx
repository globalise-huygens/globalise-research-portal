import { cn } from '../../lib';
import * as React from 'react';
import { IconArrowRight } from '../icons/IconArrowRight';

type CardHeroColor = 'turquoise' | 'vermilion' | 'mint' | 'parchment';

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
    React.HTMLAttributes<HTMLElement>,
    'color'
  >);

const CardHero = React.forwardRef<HTMLElement, CardHeroProps>((props, ref) => {
  const { className, hoverColor, label, title, children, href, ...rest } = props;
  const sharedClassName = cn('card-hero', className);

  const content = (
    <>
      {children && <div className="media">{children}</div>}

      <div className="content">
        <div className="copy">
          {label && <span className="label">{label}</span>}
          {title && <span className="title">{title}</span>}
        </div>
        <IconArrowRight className="arrow" aria-hidden="true" />
      </div>
    </>
  );

  if (href) {
    return (
      <a
        {...rest}
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={sharedClassName}
        data-color={hoverColor ?? 'turquoise'}
      >
        {content}
      </a>
    );
  }

  return (
    <article
      {...rest}
      ref={ref}
      className={sharedClassName}
      data-color={hoverColor ?? 'turquoise'}
    >
      {content}
    </article>
  );
});
CardHero.displayName = 'CardHero';

export { CardHero };
