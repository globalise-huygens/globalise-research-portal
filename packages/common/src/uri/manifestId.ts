import { idBase, uriPatterns } from './uriPatterns.ts';

export type InventoryRef = {
  inventory: string;
};

export function parseManifestId(
  id: string,
): InventoryRef | undefined {
  const groups = uriPatterns.manifest.exec(id)?.groups;
  return groups && { inventory: groups.inventory };
}

export function createManifestId(
  { inventory }: InventoryRef,
): string {
  return `${idBase}/inventory:${inventory}.manifest`;
}
