import { ReactNode } from 'react';

export type FieldProps = {
  url?: string;
  label?: string;
  fallback?: ReactNode;
  path?: string[];
};