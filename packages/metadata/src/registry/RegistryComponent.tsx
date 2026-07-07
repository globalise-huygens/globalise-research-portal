import { registryComponents } from './registryComponents.ts';
import { MetadataWithComponent } from '../MetadataModel.ts';

export type RegistryComponentProps = { entry: MetadataWithComponent };

/**
 * Render a metadata entry by the component name it is linked to
 */
export function RegistryComponent({ entry }: RegistryComponentProps) {
  const Component = registryComponents[entry.component]
    ?? registryComponents.default;
  return <Component entry={entry}/>;
}