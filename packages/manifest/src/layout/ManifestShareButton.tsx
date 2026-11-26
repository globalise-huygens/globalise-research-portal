import { useEffect, useState } from 'react';
import { VisuallyHidden } from 'react-aria-components';
import { IconCopy } from '@globalise/design';
import { TOP_BAR_BUTTON } from './buttonClasses';
import { TooltipIconButton } from './TooltipIconButton';

export type ShareLink = {
  href: string;
  label: string;
};

const copyMessages = {
  copied: 'Link copied',
  failed: 'Could not copy link',
};

type CopyStatus = keyof typeof copyMessages;

const copyMessageDuration = 2000;

type ManifestShareButtonProps = { link: ShareLink };

export function ManifestShareButton(
  { link }: ManifestShareButtonProps,
) {
  const [status, setStatus] = useState<CopyStatus>();
  const message = status && copyMessages[status];

  useEffect(hideMessageAfterDuration, [status]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link.href);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  function hideMessageAfterDuration() {
    if (!status) {
      return;
    }
    const timeout = setTimeout(() => setStatus(undefined), copyMessageDuration);
    return () => clearTimeout(timeout);
  }

  return (
    <>
      <TooltipIconButton
        aria-label={link.label}
        tooltip={message ?? link.label}
        isTooltipOpen={message ? true : undefined}
        className={TOP_BAR_BUTTON}
        icon={<IconCopy className="toolbar-icon" />}
        onPress={() => void copyLink()}
      />
      <VisuallyHidden role="status">{message}</VisuallyHidden>
    </>
  );
}
