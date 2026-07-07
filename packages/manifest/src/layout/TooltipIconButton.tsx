import type { DocumentDetailToolButtonProps } from '@globalise/design';
import {
  DocumentDetailToolButton,
  DocumentDetailTooltip,
} from '@globalise/design';
import * as React from 'react';

type TooltipIconButtonProps = DocumentDetailToolButtonProps & {
  tooltip: React.ReactNode;
  tooltipPlacement?: 'bottom' | 'top' | 'left' | 'right';
};

export function TooltipIconButton({
  tooltip,
  tooltipPlacement = 'bottom',
  ...buttonProps
}: TooltipIconButtonProps) {
  return (
    <DocumentDetailTooltip label={tooltip} placement={tooltipPlacement}>
      <DocumentDetailToolButton {...buttonProps} />
    </DocumentDetailTooltip>
  );
}
