// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import {
  copySelectedTranscriptionLines,
  formatSelectedTranscriptionLines,
} from './copySelectedTranscriptionLines';

describe('formatSelectedTranscriptionLines', () => {
  it('prefixes every selected line and restores text between fragments', () => {
    const sourceText = 'ende banda soude\nte stellen';

    expect(formatSelectedTranscriptionLines(sourceText, [
      { lineNumber: 11, start: 5, end: 10 },
      { lineNumber: 11, start: 11, end: 16 },
      { lineNumber: 12, start: 17, end: 27 },
    ])).toBe('11\tbanda soude\n12\tte stellen');
  });

  it('uses transcription order rather than input order', () => {
    const sourceText = 'first\nsecond';

    expect(formatSelectedTranscriptionLines(sourceText, [
      { lineNumber: 2, start: 6, end: 12 },
      { lineNumber: 1, start: 0, end: 5 },
    ])).toBe('1\tfirst\n2\tsecond');
  });

  it('ignores empty ranges', () => {
    expect(formatSelectedTranscriptionLines('text', [
      { lineNumber: 1, start: 2, end: 2 },
    ])).toBe('');
  });
});

describe('copySelectedTranscriptionLines', () => {
  it('copies a DOM selection as numbered source lines', () => {
    const root = document.createElement('div');
    root.innerHTML = [
      '<span data-copy-line-number="1" data-copy-text-start="0">first</span>',
      '<span data-copy-line-number="1" data-copy-text-start="6">line</span>',
      '<span data-copy-line-number="2" data-copy-text-start="11">second</span>',
      '<span data-copy-line-number="2" data-copy-text-start="18">line</span>',
    ].join('');
    document.body.appendChild(root);

    const markedParts = root.querySelectorAll('span');
    const firstText = markedParts[0].firstChild;
    const lastText = markedParts[3].firstChild;
    const selection = document.getSelection();
    if (!firstText || !lastText || !selection) {
      throw new Error('Could not create a DOM selection');
    }
    const range = document.createRange();
    range.setStart(firstText, 0);
    range.setEnd(lastText, 4);
    selection.removeAllRanges();
    selection.addRange(range);

    const setData = vi.fn();
    const preventDefault = vi.fn();
    const handled = copySelectedTranscriptionLines(
      { clipboardData: { setData }, preventDefault },
      root,
      'first line\nsecond line',
    );

    expect(handled).toBe(true);
    expect(setData).toHaveBeenCalledWith(
      'text/plain',
      '1\tfirst line\n2\tsecond line',
    );
    expect(preventDefault).toHaveBeenCalledOnce();
  });
});
