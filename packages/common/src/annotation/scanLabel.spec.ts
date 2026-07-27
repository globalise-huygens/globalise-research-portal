import { describe, expect, it } from 'vitest';
import { scanLabel, scanNumber } from './scanLabel';

describe('scanNumber', () => {
  it('removes leading zeroes from a numeric canvas name', () => {
    expect(scanNumber('https://example.org/canvas_0717')).toBe('717');
  });

  it('keeps one zero when the canvas name contains only zeroes', () => {
    expect(scanNumber('https://example.org/canvas_0000')).toBe('0');
  });

  it('preserves non-numeric canvas names', () => {
    expect(scanNumber('https://example.org/canvas_A12')).toBe('A12');
  });
});

describe('scanLabel', () => {
  it('returns the complete user-facing scan label', () => {
    expect(scanLabel('https://example.org/canvas_0717')).toBe('Scan 717');
  });
});
