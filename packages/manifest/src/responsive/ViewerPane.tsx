import { cn } from '@globalise/design';
import type { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  isBordered?: boolean;
  type: 'scan' | 'transcription';
};

export function ViewerPane({ children, isBordered = false, type }: Props) {
  return (
    <section className={cn('pane', isBordered && 'bordered')} data-view={type}>
      <div className="canvas">{children}</div>
    </section>
  );
}
