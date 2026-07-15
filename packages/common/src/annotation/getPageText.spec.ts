import { describe, expect, it } from 'vitest';
import { findPageText, getPageText } from './getPageText';

describe('page transcription text', () => {
  it('treats an annotation set without HTR text as empty', () => {
    expect(findPageText({})).toBeNull();
  });

  it('keeps the strict accessor for rendering code', () => {
    expect(() => getPageText({})).toThrow('No htr transcription');
  });
});
