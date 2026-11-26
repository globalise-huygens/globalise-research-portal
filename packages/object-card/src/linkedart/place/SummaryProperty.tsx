import type { ReactNode } from 'react';
import { cn } from '@globalise/design';

type SummaryPropertyProps = {
  label: ReactNode;
  separator?: string;
  isName?: boolean;
  children: ReactNode;
};

export function SummaryProperty({
  label,
  separator = ': ',
  isName = false,
  children,
}: SummaryPropertyProps) {
  const valueClassName = cn([
    'person-status-summary-value',
    isName && 'person-name-value',
  ]);
  return <span className="person-status-summary-property">
    <span className="person-status-summary-label">
      {label}{separator}
    </span>
    <span className={valueClassName}>{children}</span>
  </span>;
}
