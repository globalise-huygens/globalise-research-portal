import { cn } from '../../lib';
import * as React from 'react';

type CardBaseVariant =
  | 'default'
  | 'turquoise'
  | 'vermilion'
  | 'mint'
  | 'parchment'
  | 'overlay';

function cardBaseVariants({ className }: { className?: string } = {}) {
  return cn('gds-card-base', className);
}

export type CardBaseProps = {
  variant?: CardBaseVariant;
} & React.HTMLAttributes<HTMLDivElement>;

const CardBase = React.forwardRef<HTMLDivElement, CardBaseProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cardBaseVariants({ className })}
      data-variant={variant ?? 'default'}
      {...props}
    />
  ),
);
CardBase.displayName = 'CardBase';

const CardBaseHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('gds-card-base__header', className)}
    {...props}
  />
));
CardBaseHeader.displayName = 'CardBaseHeader';

const CardBaseTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('gds-card-base__title', className)} {...props} />
));
CardBaseTitle.displayName = 'CardBaseTitle';

const CardBaseDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('gds-card-base__description', className)}
    {...props}
  />
));
CardBaseDescription.displayName = 'CardBaseDescription';

const CardBaseContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('gds-card-base__content', className)}
    {...props}
  />
));
CardBaseContent.displayName = 'CardBaseContent';

const CardBaseFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('gds-card-base__footer', className)}
    {...props}
  />
));
CardBaseFooter.displayName = 'CardBaseFooter';

export {
  CardBase,
  CardBaseContent,
  CardBaseDescription,
  CardBaseFooter,
  CardBaseHeader,
  CardBaseTitle,
  cardBaseVariants,
};
