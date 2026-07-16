import * as React from 'react';
import { Tooltip, ToolButton } from '@globalise/design/viewer';

export function TooltipIconButton({
  tooltip,
  tooltipPlacement = 'bottom',
  ...buttonProps
}: React.ComponentProps<typeof ToolButton> & {
  tooltip: React.ReactNode;
  tooltipPlacement?: React.ComponentProps<typeof Tooltip>['placement'];
}) {
  return (
    <Tooltip label={tooltip} placement={tooltipPlacement}>
      <ToolButton {...buttonProps} />
    </Tooltip>
  );
}
