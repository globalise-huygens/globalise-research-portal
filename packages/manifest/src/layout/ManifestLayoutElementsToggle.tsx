import {
  setLayoutElementsVisible,
  useIsLayoutElementsVisible,
} from '@globalise/common/document';
import { IconLayoutElements } from '@globalise/design';
import { TOP_BAR_BUTTON } from './buttonClasses';
import { TooltipIconButton } from './TooltipIconButton';

const tooltip = 'Highlight layout elements and show labels and line numbers';

export function ManifestLayoutElementsToggle() {
  const isVisible = useIsLayoutElementsVisible();

  return (
    <TooltipIconButton
      aria-label={isVisible ? 'Hide layout elements' : 'Show layout elements'}
      aria-pressed={isVisible}
      tooltip={tooltip}
      isActive={isVisible}
      className={TOP_BAR_BUTTON}
      icon={
        <IconLayoutElements className="toolbar-icon" />
      }
      onPress={() => setLayoutElementsVisible(!isVisible)}
    />
  );
}
