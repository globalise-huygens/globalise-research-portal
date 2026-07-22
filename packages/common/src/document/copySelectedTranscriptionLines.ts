export type SelectedTranscriptionRange = {
  lineNumber: number;
  start: number;
  end: number;
};

type CopyEvent = {
  clipboardData: Pick<DataTransfer, 'setData'> | null;
  preventDefault: () => void;
};

export function copySelectedTranscriptionLines(
  event: CopyEvent,
  root: HTMLElement,
  sourceText: string,
) {
  if (!event.clipboardData) {
    return false;
  }

  const selection = root.ownerDocument.getSelection();
  if (!selection || selection.isCollapsed) {
    return false;
  }

  const ranges = Array.from(
    { length: selection.rangeCount },
    (_, index) => selection.getRangeAt(index),
  ).filter((range) =>
    root.contains(range.startContainer) && root.contains(range.endContainer),
  );
  if (!ranges.length) {
    return false;
  }

  const selectedRanges: SelectedTranscriptionRange[] = [];
  const parts = root.querySelectorAll<HTMLElement>(
    '[data-copy-line-number][data-copy-text-start]',
  );

  for (const part of Array.from(parts)) {
    const lineNumber = Number(part.dataset.copyLineNumber);
    const sourceStart = Number(part.dataset.copyTextStart);
    if (!Number.isFinite(lineNumber) || !Number.isFinite(sourceStart)) {
      continue;
    }

    for (const range of ranges) {
      if (!range.intersectsNode(part)) {
        continue;
      }
      const selected = selectedRangeWithin(part, range, sourceStart);
      if (selected) {
        selectedRanges.push({ lineNumber, ...selected });
      }
    }
  }

  const copiedText = formatSelectedTranscriptionLines(
    sourceText,
    selectedRanges,
  );
  if (!copiedText) {
    return false;
  }

  event.clipboardData.setData('text/plain', copiedText);
  event.preventDefault();
  return true;
}

export function formatSelectedTranscriptionLines(
  sourceText: string,
  selectedRanges: SelectedTranscriptionRange[],
) {
  const lines = new Map<number, SelectedTranscriptionRange>();

  for (const selected of selectedRanges.toSorted((a, b) => a.start - b.start)) {
    if (selected.end <= selected.start) {
      continue;
    }
    const existing = lines.get(selected.lineNumber);
    if (existing) {
      existing.start = Math.min(existing.start, selected.start);
      existing.end = Math.max(existing.end, selected.end);
    } else {
      lines.set(selected.lineNumber, { ...selected });
    }
  }

  return [...lines.values()]
    .toSorted((a, b) => a.start - b.start)
    .map(({ lineNumber, start, end }) =>
      `${lineNumber}\t${sourceText.slice(start, end)}`,
    )
    .join('\n');
}

function selectedRangeWithin(
  part: HTMLElement,
  selectionRange: Range,
  sourceStart: number,
) {
  const textLength = part.textContent?.length ?? 0;
  let start = 0;
  let end = textLength;

  if (part.contains(selectionRange.startContainer)) {
    start = textOffset(
      part,
      selectionRange.startContainer,
      selectionRange.startOffset,
    );
  }
  if (part.contains(selectionRange.endContainer)) {
    end = textOffset(
      part,
      selectionRange.endContainer,
      selectionRange.endOffset,
    );
  }

  return end > start
    ? { start: sourceStart + start, end: sourceStart + end }
    : null;
}

function textOffset(root: HTMLElement, container: Node, offset: number) {
  const range = root.ownerDocument.createRange();
  range.selectNodeContents(root);
  range.setEnd(container, offset);
  return range.toString().length;
}
