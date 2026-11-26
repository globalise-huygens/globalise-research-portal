import { describe, expect, it } from 'vitest';
import { handle, idBase } from './uriPatterns.ts';
import { isInternalUri } from './isInternalUri';

describe(isInternalUri.name, () => {
  it('accepts uris within the handle on the data host', () => {
    expect(isInternalUri(`${idBase}/foo:bar`)).toBe(true);
  });

  it('accepts uris within the handle on the id host', () => {
    expect(isInternalUri(`https://id.globalise.nl/${handle}/foo:bar`)).toBe(true);
  });

  it('rejects uris within the handle on other hosts', () => {
    expect(isInternalUri(`https://foo.bar/${handle}/foo:bar`)).toBe(false);
  });

  it('rejects uris outside the handle', () => {
    expect(isInternalUri('https://data.globalise.huygens.knaw.nl/foo')).toBe(false);
  });

  it('rejects a missing uri', () => {
    expect(isInternalUri(undefined)).toBe(false);
  });
});
