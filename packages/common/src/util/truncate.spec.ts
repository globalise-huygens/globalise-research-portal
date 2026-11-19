import { describe, expect, it } from 'vitest';
import { truncate } from './truncate.ts';

describe(truncate.name, () => {
  const text = 'foo bar baz';

  it('marks a cut at both sides', () => {
    expect(truncate(text, 4, 7)).toBe('[..] bar [..]');
  });

  it('marks a cut at the end only', () => {
    expect(truncate(text, 0, 3)).toBe('foo [..]');
  });

  it('marks a cut with a custom omission', () => {
    expect(truncate(text, 0, 3, '…')).toBe('foo …');
  });

  it('keeps the text whole when nothing is cut', () => {
    expect(truncate(text, 0, text.length)).toBe(text);
  });
});
