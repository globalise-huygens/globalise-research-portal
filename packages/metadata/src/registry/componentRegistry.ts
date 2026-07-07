import { ComponentType } from 'react';
import { ComponentName } from '../MetadataModel';
import { Li } from './Li.tsx';
import { Doc } from './Doc.tsx';
import { MetadataComponentProps } from './MetadataComponentProps.tsx';
import { Timespan } from './Timespan.tsx';

export type ComponentRegistry = Record<
  ComponentName,
  ComponentType<MetadataComponentProps>
>;

export const componentRegistry = {
  [Doc.name]: Doc,
  [Li.name]: Li,
  [Timespan.name]: Timespan,
  default: Li,
} satisfies ComponentRegistry;