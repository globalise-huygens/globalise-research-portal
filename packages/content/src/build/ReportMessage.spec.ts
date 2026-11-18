import { VFile } from 'vfile';
import { describe, expect, it } from 'vitest';
import { formatReportMessage, toReportMessage } from './ReportMessage.ts';

const place = { line: 1, column: 2 };

describe(toReportMessage.name, () => {
  it('locates a message from the portal root', () => {
    const message = createFile().message('foo', { place, ruleId: 'a' });
    message.fatal = true;
    const reportMessage = toReportMessage(message, 'foo');
    expect(reportMessage).toEqual({
      location: {
        file: 'foo/pages/a.md',
        line: 1,
        column: 2,
        full: 'foo/pages/a.md:1:2',
      },
      level: 'error',
      reason: 'foo',
      ruleId: 'a',
    });
  });

  it('locates a message without a place by its file', () => {
    const message = createFile().message('bar');
    const { location } = toReportMessage(message, 'foo');
    expect(location.full).toBe('foo/pages/a.md');
  });
});

describe(formatReportMessage.name, () => {
  it('shows the level, the reason and the full location', () => {
    const message = createFile().message('foo', { place, ruleId: 'a' });
    const reportMessage = toReportMessage(message, 'foo');
    const formatted = formatReportMessage(reportMessage);
    expect(formatted).toBe('WARNING: foo, file: foo/pages/a.md:1:2');
  });
});

function createFile(): VFile {
  return new VFile({ path: 'pages/a.md' });
}
