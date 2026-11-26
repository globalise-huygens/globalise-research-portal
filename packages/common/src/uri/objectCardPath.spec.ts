import { describe, expect, it } from 'vitest';
import { handle, idBase } from './uriPatterns.ts';
import { createObjectCardPath, createObjectCardSplat, parseObjectCardSplat } from './objectCardPath';

const uri = `${idBase}/foo:bar`;
const splat = 'foo:bar';
const externalUri = 'https://foo.bar/baz';

describe(createObjectCardPath.name, () => {
  it('builds the path of an object card', () => {
    expect(createObjectCardPath(uri)).toBe(`/${handle}/foo:bar`);
  });

  it('ignores uris outside the handle', () => {
    expect(createObjectCardPath(externalUri)).toBeNull();
  });
});

describe(createObjectCardSplat.name, () => {
  it('reads the type and id of a uri', () => {
    expect(createObjectCardSplat(uri)).toBe(splat);
  });

  it('reads the type and id of a uri on another host', () => {
    expect(createObjectCardSplat(`https://id.globalise.nl/${handle}/foo:bar`)).toBe(splat);
  });

  it('ignores uris outside the handle', () => {
    expect(createObjectCardSplat(externalUri)).toBeNull();
  });
});

describe(parseObjectCardSplat.name, () => {
  it('prepends the id base to the splat', () => {
    expect(parseObjectCardSplat(splat)).toBe(uri);
  });

  it('ignores splats without a type', () => {
    expect(parseObjectCardSplat('foo')).toBeNull();
  });
});
