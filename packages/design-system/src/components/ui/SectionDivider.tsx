import { Container } from '@/components/ui/Container';
import { Divider } from '@/components/ui/Divider';
import { cn } from '@/lib/utils';
import * as React from 'react';

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
