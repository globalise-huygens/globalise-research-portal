import { cn } from '../../lib';
import * as React from 'react';

type TypographyVariant = keyof VariantElement;

function typographyVariants({ className }: { className?: string } = {}) {
  return cn('gds-typography', className);
}

type VariantElement = {
  display: 'h1';
  h1: 'h1';
  h2: 'h2';
  h3: 'h3';
  h4: 'h4';
  hero: 'h2';
  p: 'p';
  lead: 'p';
  large: 'div';
  small: 'small';
  muted: 'p';
  blockquote: 'blockquote';
  code: 'code';
  label: 'span';
  subtitle: 'p';
};

const variantElementMap: VariantElement = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  hero: 'h2',
  p: 'p',
  lead: 'p',
  large: 'div',
  small: 'small',
  muted: 'p',
  blockquote: 'blockquote',
  code: 'code',
  label: 'span',
  subtitle: 'p',
};

export type TypographyProps = {
  variant?: TypographyVariant;
  /** Render as a different element or component, overriding the variant default */
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>;

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'p', as, ...props }, ref) => {
    const Comp =
      as ?? variantElementMap[variant] ?? 'p';
    return (
      <Comp
        className={typographyVariants({ className })}
        data-variant={variant}
        ref={ref as React.Ref<never>}
        {...props}
      />
    );
  },
);
Typography.displayName = 'Typography';

export { Typography, typographyVariants };
