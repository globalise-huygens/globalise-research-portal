import { describe, expect, it } from 'vitest';
import { getStatusLabel } from './getStatusLabel.ts';

describe(getStatusLabel.name, () => {
  it('joins ascribed values, leaving out relations', () => {
    const status = {
      type: 'SocialStatus',
      ascribes_social_status: { type: 'Type', _label: 'clerk' },
      ascribes_social_status_relation: { type: 'Type', _label: 'of' },
    };
    expect(getStatusLabel(status)).toBe('clerk');
  });

  it('falls back to the status label', () => {
    const status = {
      type: 'SocialStatus',
      _label: 'unknown status',
    };
    expect(getStatusLabel(status)).toBe('unknown status');
  });
});
