import { componentRegistry } from './componentRegistry.ts';
import { MetadataWithComponent } from '../MetadataModel.ts';

export type RegistryComponentProps = { entry: MetadataWithComponent };

/**
 * Render a metadata entry by the component name it is linked to
 */
export function RegistryComponent({ entry }: RegistryComponentProps) {
  const Component = componentRegistry[entry.component]
    ?? componentRegistry.default;
  return <>
    <Component entry={entry}/>
  </>;
}