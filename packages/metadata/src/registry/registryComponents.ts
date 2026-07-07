import { ComponentType } from 'react';
import { Doc } from './components/Doc';
import { Li } from './components/Li';
import { Timespan } from './components/Timespan';
import { RegistryComponentProps } from './RegistryComponent.tsx';

export type RegistryComponentConfig = Record<
  string,
  ComponentType<RegistryComponentProps>
>;

export const registryComponents = {
  Doc,
  Li,
  Timespan,
  default: Li,
} satisfies RegistryComponentConfig;

export type RegistryComponentName = keyof typeof registryComponents;