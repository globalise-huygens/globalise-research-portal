import { cn } from '@globalise/design';
import { type ReactNode } from 'react';
import './ControlBar.css';

type ControlBarProps = {
  children: ReactNode;
  className?: string;
};

export function ControlBar({ children, className }: ControlBarProps) {
  return (
    <div className={cn('gds-document-detail-control-bar', className)}>
      {children}
    </div>
  );
}
