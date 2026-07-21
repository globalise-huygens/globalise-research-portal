import { cn } from '../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from 'react-aria-components';

export type ToolButtonProps = {
  className?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  size?: 'compact' | 'regular' | 'touch';
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'children' | 'className' | 'style'
>;

const ToolButton = React.forwardRef<
  HTMLButtonElement,
  ToolButtonProps
>(
  (
    { className, icon, isActive = false, size = 'regular', children, ...props },
    ref,
  ) => (
    <AriaButton
      ref={ref}
      className={cn('tool-button', className)}
      data-active={isActive ? 'true' : 'false'}
      data-size={size}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </AriaButton>
  ),
);
ToolButton.displayName = 'ToolButton';

export type ToggleGroupProps = {
  className?: string;
  size?: 'compact' | 'regular';
  children?: React.ReactNode;
} & Omit<
  AriaToggleButtonGroupProps,
  'className' | 'style'
>;

function ToggleGroup({
  className,
  size = 'regular',
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <AriaToggleButtonGroup
      className={cn('toggle-group', className)}
      data-size={size}
      {...props}
    >
      {children}
    </AriaToggleButtonGroup>
  );
}

export type ToggleProps = {
  className?: string;
  icon?: React.ReactNode;
  size?: 'compact' | 'regular';
  children?: React.ReactNode;
} & Omit<
  AriaToggleButtonProps,
  'children' | 'className' | 'style'
>;

const Toggle = React.forwardRef<
  HTMLButtonElement,
  ToggleProps
>(({ className, icon, size = 'regular', children, ...props }, ref) => (
  <AriaToggleButton
    ref={ref}
    className={cn('toggle', className)}
    data-size={size}
    {...props}
  >
    {icon}
    {children && <span>{children}</span>}
  </AriaToggleButton>
));
Toggle.displayName =
  'Toggle';

export type CheckboxProps = {
  className?: string;
  indicatorClassName?: string;
  children?: React.ReactNode;
} & Omit<
  AriaCheckboxProps,
  'children' | 'className' | 'style'
>;

const Checkbox = React.forwardRef<
  HTMLLabelElement,
  CheckboxProps
>(({ className, indicatorClassName, children, ...props }, ref) => (
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  <AriaCheckbox
    ref={ref}
    className={cn('checkbox-control', className)}
    {...props}
  >
    {({ isIndeterminate }) => (
      <>
        <span
          className={cn('indicator', indicatorClassName)}
          aria-hidden="true"
        >
          {isIndeterminate ? (
            <span className="indeterminate" />
          ) : (
            <svg
              className="check"
              viewBox="0 -960 960 960"
              focusable="false"
              aria-hidden="true"
            >
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
          )}
        </span>
        {children && <span>{children}</span>}
      </>
    )}
  </AriaCheckbox>
));
Checkbox.displayName = 'Checkbox';

export {
  Checkbox,
  ToggleGroup,
  Toggle,
  ToolButton,
};
