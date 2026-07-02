import { IconArrowRight } from '@/components/icons/IconArrowRight';
import { cn } from '@/lib/utils';
import * as React from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components';

type ButtonVariant = 'default' | 'outline' | 'link' | 'nav';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

function buttonVariants({ className }: { className?: string } = {}) {
  return cn('gds-button', className);
}

export type ButtonProps = {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  as?: React.ElementType;
} & Omit<
  AriaButtonProps,
  'className' | 'style'
>;

export type ButtonLinkProps = {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & Omit<
  AriaLinkProps,
  'className' | 'style'
>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, as, children, ...props }, ref) => {
    const content =
      variant === 'link' ? (
        <>
          {children}
          <IconArrowRight aria-hidden="true" />
        </>
      ) : (
        children
      );

    if (as) {
      const Comp = as;
      return (
        <Comp
          className={buttonVariants({ className })}
          data-size={size ?? 'default'}
          data-variant={variant ?? 'default'}
          ref={ref}
          {...props}
        >
          {content}
        </Comp>
      );
    }
    return (
      <AriaButton
        className={buttonVariants({ className })}
        data-size={size ?? 'default'}
        data-variant={variant ?? 'default'}
        ref={ref}
        {...props}
      >
        {content}
      </AriaButton>
    );
  },
);
Button.displayName = 'Button';

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const content =
      variant === 'link' ? (
        <>
          {children}
          <IconArrowRight aria-hidden="true" />
        </>
      ) : (
        children
      );

    return (
      <AriaLink
        className={buttonVariants({ className })}
        data-size={size ?? 'default'}
        data-variant={variant ?? 'default'}
        ref={ref}
        {...props}
      >
        {content}
      </AriaLink>
    );
  },
);
ButtonLink.displayName = 'ButtonLink';

export { Button, ButtonLink, buttonVariants };
