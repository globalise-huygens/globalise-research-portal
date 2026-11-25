import * as React from 'react';
import { Tooltip, ToolButton } from '@globalise/design';

export function TooltipIconButton({
  tooltip,
  tooltipPlacement = 'bottom',
  isTooltipOpen,
  ...buttonProps
}: React.ComponentProps<typeof ToolButton> & {
  tooltip: React.ReactNode;
  tooltipPlacement?: React.ComponentProps<typeof Tooltip>['placement'];
  isTooltipOpen?: boolean;
}) {
  return (
    <Tooltip label={tooltip} placement={tooltipPlacement} isOpen={isTooltipOpen}>
      <ToolButton {...buttonProps} />
    </Tooltip>
  );
}
