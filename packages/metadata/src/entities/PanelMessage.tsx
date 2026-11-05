import type { PanelMessageStatus } from './PanelData.ts';

const messages: Record<PanelMessageStatus, string> = {
  noDocument: 'No document on this scan.',
  loading: 'Loading…',
  failed: 'Not available for this document.',
};

type PanelMessageProps = {
  status: PanelMessageStatus;
};

export function PanelMessage({ status }: PanelMessageProps) {
  return <div className="toc-empty">{messages[status]}</div>;
}
