type RangeRef = { id: string };
type ManifestJson = { structures?: { items?: RangeRef[] }[] };

// TODO: remove when document ranges in the manifest have unique ids:
//  the vault merges ranges with the same id into one range.
export async function fetchPatchManifest(
  url: string,
): Promise<ManifestJson | undefined> {
  try {
    const manifest: ManifestJson = await (await fetch(url)).json();
    manifest.structures?.forEach((range) => makeIdsUnique(range.items ?? []));
    return manifest;
  } catch {
    return undefined;
  }
}

function makeIdsUnique(ranges: RangeRef[]): void {
  const counts = new Map<string, number>();
  for (const range of ranges) {
    const count = (counts.get(range.id) ?? 0) + 1;
    counts.set(range.id, count);
    if (count > 1) {
      range.id = `${range.id}#${count}`;
    }
  }
}
