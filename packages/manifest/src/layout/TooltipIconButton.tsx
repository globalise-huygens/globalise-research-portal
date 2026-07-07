import * as React from 'react';
import { DocumentDetailTooltip, DocumentDetailToolButton } from '@globalise/design';

export function TooltipIconButton({
  tooltip,
  tooltipPlacement = 'bottom',
  ...buttonProps
}: React.ComponentProps<typeof DocumentDetailToolButton> & {
  tooltip: React.ReactNode;
  tooltipPlacement?: React.ComponentProps<typeof DocumentDetailTooltip>['placement'];
}) {
  return (
    <DocumentDetailTooltip label={tooltip} placement={tooltipPlacement}>
      <DocumentDetailToolButton {...buttonProps} />
    </DocumentDetailTooltip>
  );
}
