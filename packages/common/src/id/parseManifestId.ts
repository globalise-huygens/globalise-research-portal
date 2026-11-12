import { idPatterns } from './idPatterns';

export type InventoryRef = {
  inventory: string;
};

export function parseManifestId(id: string): InventoryRef | undefined {
  const groups = idPatterns.manifest.exec(id)?.groups;
  return groups && { inventory: groups.inventory };
}
