import { cn } from '../../lib';
import * as React from 'react';

type ContainerSize = 'shell' | 'content' | 'narrow' | 'full';
type ContainerInset = 'page' | 'none';

function containerVariants({ className }: { className?: string } = {}) {
  return cn('gds-container', className);
}

export type ContainerProps = {
  size?: ContainerSize;
  inset?: ContainerInset;
} & React.ComponentPropsWithRef<'div'>;

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={containerVariants({ className })}
      data-inset={inset ?? 'page'}
      data-size={size ?? 'shell'}
      {...props}
    />
  ),
);
Container.displayName = 'Container';

export { Container, containerVariants };
