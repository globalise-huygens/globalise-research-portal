import { describe, expect, it } from 'vitest';
import { parseManifestId } from './parseManifestId';

describe(parseManifestId.name, () => {
  // future: https://id.globalise.nl/hdl:20.500.14722
  const handle = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';

  const manifest = `${handle}/inventory:1053.manifest`;
  const manifestPostfixed = `${handle}/inventory:1171A.manifest`;
  const range = `${manifest}/range/NL-HaNA_1.04.02_1053_0003-0067`;

  it('reads the inventory of a manifest', () => {
    expect(parseManifestId(manifest)).toEqual({ inventory: '1053' });
  });

  it('reads an inventory with a letter', () => {
    const inventory = parseManifestId(manifestPostfixed);
    expect(inventory).toEqual({ inventory: '1171A' });
  });

  it('ignores a range within the manifest', () => {
    expect(parseManifestId(range)).toBeUndefined();
  });
});
