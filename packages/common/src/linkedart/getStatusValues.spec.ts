import { describe, expect, it } from 'vitest';
import { getStatusValues } from './getStatusValues.ts';

const clerk = { type: 'Type', _label: 'clerk' };

describe(getStatusValues.name, () => {
  it('reads nodes and literal values', () => {
    const writer = {
      type: 'xsd:string',
      '@value': 'writer',
    };
    const status = {
      type: 'SocialStatus',
      ascribes_social_status: [clerk, writer],
    };
    const key = ['ascribes_social_status'];
    expect(getStatusValues(status, key)).toEqual([clerk, 'writer']);
  });

  it('reads the first key that has values', () => {
    const status = {
      type: 'AppellativeStatus',
      'aaao:ZP6_ascribes_appellation': 'Jan',
    };
    const possibleKeys = [
      'ascribes_appellation',
      'aaao:ZP6_ascribes_appellation',
    ];
    expect(getStatusValues(status, possibleKeys)).toEqual(['Jan']);
  });
});
