import { createElement, type ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Highlight } from './Highlight';

const points = '0,0 10,0 10,10 0,10';

function renderHighlight(
  highlightStyle: ComponentProps<typeof Highlight>['highlightStyle'],
  props: Partial<ComponentProps<typeof Highlight>> = {},
) {
  return renderToStaticMarkup(
    createElement(
      'svg',
      null,
      createElement(Highlight, { points, highlightStyle, ...props }),
    ),
  );
}

describe('Highlight', () => {
  it('renders a halo below the interactive highlight', () => {
    const markup = renderHighlight({
      fill: 'pink',
      stroke: 'red',
      strokeWidth: 1,
      haloStroke: 'white',
      haloStrokeWidth: 3,
    });

    expect(markup).toContain('fill="none" stroke="white" stroke-width="3"');
    expect(markup.indexOf('stroke="white"')).toBeLessThan(
      markup.indexOf('fill="pink"'),
    );
  });

  it('uses the same partial outline for joined highlight halos', () => {
    const markup = renderHighlight({
      fill: 'pink',
      stroke: 'red',
      strokeWidth: 1,
      haloStroke: 'white',
      omitLeftStroke: true,
    });

    expect(markup.match(/<path/g)).toHaveLength(2);
    expect(markup).toContain('stroke="white" stroke-width="3"');
    expect(markup).toContain('stroke="red" stroke-width="1"');
  });

  it('exposes clickable highlights to keyboard users', () => {
    const markup = renderHighlight(
      { fill: 'transparent' },
      { ariaLabel: 'banda', onClick: () => undefined },
    );

    expect(markup).toContain('aria-label="banda"');
    expect(markup).toContain('role="button"');
    expect(markup).toContain('tabindex="0"');
  });
});
