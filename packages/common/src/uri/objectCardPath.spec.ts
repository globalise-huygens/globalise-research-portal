import { describe, expect, it } from 'vitest';
import { createObjectCardPath, createObjectCardSplat, parseObjectCardSplat } from './objectCardPath';

const uri = 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/foo:bar';
const splat = 'foo:bar';

describe(createObjectCardPath.name, () => {
  it('builds the path of an object card', () => {
    expect(createObjectCardPath(uri)).toBe('/hdl:20.500.14722/foo:bar');
  });
});

describe(createObjectCardSplat.name, () => {
  it('strips the id base from the uri', () => {
    expect(createObjectCardSplat(uri)).toBe(splat);
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
