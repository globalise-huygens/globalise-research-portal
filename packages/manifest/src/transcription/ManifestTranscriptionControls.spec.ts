import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ManifestTranscriptionControls } from './ManifestTranscriptionControls.tsx';

vi.mock('@globalise/common/document', () => ({
  setDiplomaticViewScale: vi.fn(),
  setTranscriptionMode: vi.fn(),
  useDiplomaticViewScale: () => 100,
  useTranscriptionMode: () => 'line-by-line',
}));

describe('ManifestTranscriptionControls', () => {
  it('uses the shared toolbar parts inside its layout wrapper', () => {
    const markup = renderToStaticMarkup(
      createElement(ManifestTranscriptionControls),
    );

    expect(markup).toContain('class="transcription-toolbar"');
    expect(markup).toContain('class="zoom-controls"');
    expect(markup).toContain('class="tool-button"');
    expect(markup).toContain('<svg');
    expect(markup).toContain('class="toolbar-divider"');
    expect(markup).not.toContain('class="button"');
    expect(markup).not.toContain('class="icon"');
  });
});
