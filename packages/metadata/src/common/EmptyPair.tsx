import { ReactNode } from 'react';
import { Pair } from './Pair.tsx';

export type EmptyPairProps = {
  label: string;
  fallback?: ReactNode;
};

/**
 * Render a fallback when a field has no value,
 * or nothing when no fallback is provided.
 */
export function EmptyPair({ label, fallback }: EmptyPairProps) {
  if (!fallback) {
    return null;
  }
  return <Pair label={label}>{fallback}</Pair>;
}