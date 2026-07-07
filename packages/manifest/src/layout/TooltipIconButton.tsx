import * as React from 'react';
import { DocumentDetailTooltip, DocumentDetailToolButton } from '@globalise/design';

type TooltipIconButtonProps = React.ComponentProps<'button'> & {
  icon?: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
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
