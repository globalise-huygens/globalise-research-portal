import * as React from 'react';
import { ViewerTooltip, ViewerToolButton } from '@globalise/design';

export function TooltipIconButton({
  tooltip,
  tooltipPlacement = 'bottom',
  ...buttonProps
}: React.ComponentProps<typeof ViewerToolButton> & {
  tooltip: React.ReactNode;
  tooltipPlacement?: React.ComponentProps<typeof ViewerTooltip>['placement'];
}) {
  return (
    <ViewerTooltip label={tooltip} placement={tooltipPlacement}>
      <ViewerToolButton {...buttonProps} />
    </ViewerTooltip>
  );
}
