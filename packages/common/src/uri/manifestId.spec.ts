import { describe, expect, it } from 'vitest';
import { createManifestId, parseManifestId } from './manifestId';

// future: https://id.globalise.nl/hdl:20.500.14722
const handle = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722';

const manifest = `${handle}/inventory:1053.manifest`;
const manifestPostfixed = `${handle}/inventory:1171A.manifest`;
const range = `${manifest}/range/NL-HaNA_1.04.02_1053_0003-0067`;

describe(parseManifestId.name, () => {
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

describe(createManifestId.name, () => {
  it('builds the manifest id of an inventory', () => {
    expect(createManifestId({ inventory: '1053' })).toBe(manifest);
  });

  it('builds the manifest id of the inventory of a scan', () => {
    const page = { inventory: '1053', page: '0004' };
    expect(createManifestId(page)).toBe(manifest);
  });
});
