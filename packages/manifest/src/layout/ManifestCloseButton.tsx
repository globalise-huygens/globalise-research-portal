import { IconClose } from '@globalise/design';
import { TOP_BAR_BUTTON } from './buttonClasses';
import { TooltipIconButton } from './TooltipIconButton';

export function ManifestCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="top-bar-divider vertical"
      />
      <TooltipIconButton
        aria-label="Close manifest viewer"
        tooltip="Close manifest viewer"
        className={TOP_BAR_BUTTON}
        icon={
          <IconClose className="toolbar-icon" />
        }
        onPress={onClose}
      />
    </>
  );
}
