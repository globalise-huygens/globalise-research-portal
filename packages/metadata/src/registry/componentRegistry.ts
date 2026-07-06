import { ComponentType } from 'react';
import { ComponentName } from '../MetadataModel';
import { Li } from './Li.tsx';
import { Doc } from './Doc.tsx';
import { MetadataComponentProps } from './MetadataComponentProps.tsx';

export type ComponentRegistry = Record<
  ComponentName,
  ComponentType<MetadataComponentProps>
>;

export const componentRegistry = {
  [Li.name]: Li,
  [Doc.name]: Doc,
  default: Li,
} satisfies ComponentRegistry;