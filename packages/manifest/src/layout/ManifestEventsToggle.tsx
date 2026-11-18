import { eventCategory } from '@globalise/common/annotation';
import {
  toggleHighlightCategory,
  useHighlightCategories,
} from '@globalise/common/document';
import { IconEvents } from '@globalise/design';
import { TOP_BAR_BUTTON } from './buttonClasses';
import { TooltipIconButton } from './TooltipIconButton';

const tooltip = 'Highlight events';

export function ManifestEventsToggle() {
  const isVisible = useHighlightCategories().has(eventCategory);

  return (
    <TooltipIconButton
      aria-label={isVisible ? 'Hide events' : 'Show events'}
      aria-pressed={isVisible}
      tooltip={tooltip}
      isActive={isVisible}
      className={TOP_BAR_BUTTON}
      icon={
        <IconEvents className="toolbar-icon" />
      }
      onPress={() => toggleHighlightCategory(eventCategory)}
    />
  );
}
