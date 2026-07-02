import { cn } from '../../lib';
import * as React from 'react';
import { Container } from './Container.tsx';
import { Divider } from './Divider.tsx';

export type SectionDividerProps = {} & React.HTMLAttributes<HTMLDivElement>;

const SectionDivider = React.forwardRef<HTMLDivElement, SectionDividerProps>(
  ({ className, ...props }, ref) => (
    <Container
      ref={ref}
      className={cn('gds-section-divider', className)}
      {...props}
    >
      <Divider />
    </Container>
  ),
);
SectionDivider.displayName = 'SectionDivider';

export { SectionDivider };
