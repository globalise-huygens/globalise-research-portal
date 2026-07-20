import { ReactNode } from 'react';
import { Pair } from './Pair.tsx';

export type EmptyPairProps = {
  label: string;
  fallback?: ReactNode;
};

export function EmptyPair({ label, fallback }: EmptyPairProps) {
  if (!fallback) {
    return null;
  }
  return <Pair label={label}>{fallback}</Pair>;
}