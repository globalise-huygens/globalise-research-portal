import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ScanLabel } from './ScanLabel';

describe('ScanLabel', () => {
  it('leaves the accessible name to its labelled transcription group', () => {
    const markup = renderToStaticMarkup(
      createElement(ScanLabel, { number: '717', isCurrent: true }),
    );

    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('Scan</span>717');
  });
});
