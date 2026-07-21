import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FacsimileCanvas, TranscriptionLine } from './Canvases';

describe('viewer content surfaces', () => {
  it('names the scan surface as a facsimile canvas', () => {
    const markup = renderToStaticMarkup(createElement(FacsimileCanvas));

    expect(markup).toBe('<div class="facsimile-canvas"></div>');
  });

  it('uses scoped classes for transcription line parts', () => {
    const markup = renderToStaticMarkup(
      createElement(TranscriptionLine, { index: 12 }),
    );

    expect(markup).toContain('<span class="index">12</span>');
    expect(markup).toContain('class="mark"');
    expect(markup).not.toContain('data-slot');
  });
});
