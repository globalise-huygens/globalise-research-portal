import { IconShare } from '@globalise/design';
import { TOP_BAR_BUTTON } from './buttonClasses';
import { TooltipIconButton } from './TooltipIconButton';

export function ManifestShareButton({ onShare }: { onShare: () => void }) {
  return (
    <TooltipIconButton
      aria-label="Copy link to share"
      tooltip="Copy link to share"
      className={TOP_BAR_BUTTON}
      icon={
        <IconShare className="toolbar-icon" />
      }
      onPress={onShare}
    />
  );
}
