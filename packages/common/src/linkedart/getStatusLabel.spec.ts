import { describe, expect, it } from 'vitest';
import { getStatusLabel } from './getStatusLabel.ts';

describe(getStatusLabel.name, () => {
  it('joins ascribed values, leaving out relations', () => {
    const status = {
      type: 'SocialStatus',
      ascribes_social_status: {
        type: 'Type',
        id: 'https://data.example.org/type:clerk',
        prefLabel: [{ '@value': 'clerk' }],
      },
      ascribes_social_status_relation: {
        type: 'Type',
        id: 'https://data.example.org/type:of',
        prefLabel: [{ '@value': 'of' }],
      },
    };
    expect(getStatusLabel(status)).toBe('clerk');
  });

  it('falls back to the status label', () => {
    const status = {
      type: 'SocialStatus',
      id: 'https://data.example.org/status:unknown',
    };
    expect(getStatusLabel(status)).toBe('https://data.example.org/status:unknown');
  });
});
