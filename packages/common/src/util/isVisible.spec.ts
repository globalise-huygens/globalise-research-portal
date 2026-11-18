import { describe, it, expect } from 'vitest';
import { isVisible } from './isVisible';

const container = withBounds(100, 500);

describe('isVisible', () => {
  it('is true when the element fits within the container', () => {
    expect(isVisible(container, withBounds(200, 300))).toBe(true);
  });

  it('is false when the element sticks out above or below the container', () => {
    expect(isVisible(container, withBounds(50, 150))).toBe(false);
    expect(isVisible(container, withBounds(450, 550))).toBe(false);
  });

  it('is false when the element is hidden behind the top inset', () => {
    expect(isVisible(container, withBounds(120, 200), 40)).toBe(false);
  });
});

function withBounds(top: number, bottom: number): Element {
  return { getBoundingClientRect: () => ({ top, bottom }) } as Element;
}
