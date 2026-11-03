import { describe, expect, it } from 'vitest';
import { truncate } from './truncate.ts';

describe(truncate.name, () => {
  const text = 'Colonial archives of Batavia';

  it('marks a cut at both sides', () => {
    expect(truncate(text, 9, 17)).toBe('[..] archives [..]');
  });

  it('marks a cut at the end only', () => {
    expect(truncate(text, 0, 8)).toBe('Colonial [..]');
  });

  it('marks a cut with a custom omission', () => {
    expect(truncate(text, 0, 8, '…')).toBe('Colonial …');
  });

  it('keeps the text whole when nothing is cut', () => {
    expect(truncate(text, 0, text.length)).toBe(text);
  });
});
