import { cn } from '../../lib';
import * as React from 'react';
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components';

export type TooltipProps = {
  children: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  delay?: number;
  closeDelay?: number;
  isDisabled?: boolean;
} & Omit<AriaTooltipProps, 'children' | 'className'>;

export function Tooltip({
  children,
  label,
  className,
  delay = 350,
  closeDelay = 80,
  isDisabled = false,
  placement = 'bottom',
  offset = 8,
  ...props
}: TooltipProps) {
  return (
    <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} isDisabled={isDisabled}>
      {children}
      <AriaTooltip
        placement={placement}
        offset={offset}
        className={cn('tooltip', className)}
        {...props}
      >
        {label}
      </AriaTooltip>
    </AriaTooltipTrigger>
  );
}
