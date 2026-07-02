import { cn } from '@/lib/utils';
import * as React from 'react';
import { Container, type ContainerProps } from './Container';

type SectionBackground = 'dark' | 'light';
type SectionSpacing = 'default' | 'large';

function sectionVariants({ className }: { className?: string } = {}) {
  return cn('gds-section', className);
}

export type SectionProps = {
  background?: SectionBackground;
  spacing?: SectionSpacing;
  /** When true, wraps children in a shared Container automatically. */
  withContainer?: boolean;
  /** Container width preset used when withContainer is true. */
  containerSize?: ContainerProps['size'];
  /** Container inset preset used when withContainer is true. */
  containerInset?: ContainerProps['inset'];
  /** Additional classes applied to the internal Container wrapper. */
  containerClassName?: string;
} & React.HTMLAttributes<HTMLElement>;

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      background,
      spacing,
      withContainer = false,
      containerSize = 'shell',
      containerInset = 'page',
      containerClassName,
      children,
      ...props
    },
    ref,
  ) => (
    <section
      ref={ref}
      className={sectionVariants({ className })}
      data-background={background ?? 'dark'}
      data-spacing={spacing ?? 'default'}
      {...props}
    >
      {withContainer ? (
        <Container
          size={containerSize}
          inset={containerInset}
          className={containerClassName}
        >
          {children}
        </Container>
      ) : (
        children
      )}
    </section>
  ),
);
Section.displayName = 'Section';

export { Section, sectionVariants };
