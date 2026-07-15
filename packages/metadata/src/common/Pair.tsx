import { ReactNode } from 'react';

export type PairProps = {
  label: string;
  children: ReactNode;
};

export function Pair({ label, children }: PairProps) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}