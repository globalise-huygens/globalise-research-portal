import { cn } from '../../../../lib';
import * as React from 'react';
import { ViewerToolButton } from '../Controls';
import { ViewerTooltip } from '../Surfaces';

export type ManifestViewerIconButtonProps = {
  'aria-label': string;
  tooltip?: React.ReactNode;
  icon: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  variant?: 'chrome' | 'quiet';
};

export function ManifestViewerIconButton({
  'aria-label': ariaLabel,
  tooltip,
  icon,
  isActive,
  isDisabled,
  onPress,
  variant = 'chrome',
}: ManifestViewerIconButtonProps) {
  const button = (
    <ViewerToolButton
      aria-label={ariaLabel}
      className={cn(
        'manifest-viewer-icon-button',
        variant === 'quiet' && 'manifest-viewer-icon-button--quiet',
      )}
      icon={icon}
      isActive={isActive}
      isDisabled={isDisabled}
      onPress={onPress}
      size="compact"
    />
  );

  if (!tooltip) {
    return button;
  }

  return <ViewerTooltip label={tooltip}>{button}</ViewerTooltip>;
}
