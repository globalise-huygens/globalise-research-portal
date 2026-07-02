import { cn } from '@/lib/utils';
import * as React from 'react';
import { Link as AriaLink } from 'react-aria-components';
import { IconArrowRight } from '../icons/IconArrowRight';

type CardArticleBaseProps = {
  /** Category label (e.g. "Article", "News") */
  label: string;
  /** Card title */
  title: string;
  /** Image element rendered at the top of the card */
  image?: React.ReactNode;
  className?: string;
};

export type CardArticleProps =
  | (CardArticleBaseProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'color'
  >)
  | (CardArticleBaseProps & {
    href?: never;
  } & React.HTMLAttributes<HTMLDivElement>);

const CardArticle = React.forwardRef<HTMLElement, CardArticleProps>(
  ({ className, label, title, image, ...props }, ref) => {
    const href = 'href' in props ? props.href : undefined;

    const content = (
      <>
        {image && <div className="gds-card-article__image">{image}</div>}
        <div className="gds-card-article__copy">
          <span className="gds-card-article__label">{label}</span>
          <span className="gds-card-article__title">{title}</span>
        </div>
        <IconArrowRight className="gds-card-article__icon" aria-hidden="true" />
      </>
    );

    if (href) {
      return (
        <AriaLink
          href={href}
          ref={ref as React.RefObject<HTMLAnchorElement>}
          className={cn('gds-card-article', className)}
        >
          {content}
        </AriaLink>
      );
    }

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn('gds-card-article', className)}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {content}
      </div>
    );
  },
);
CardArticle.displayName = 'CardArticle';

export { CardArticle };
