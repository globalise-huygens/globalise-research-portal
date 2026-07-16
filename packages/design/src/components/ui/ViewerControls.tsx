import { cn } from '../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
  Input as AriaInput,
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from 'react-aria-components';
import { IconArrowTopRight } from '../icons/IconArrowTopRight';
import { IconContentWarning } from '../icons/IconContentWarning';

export type ViewerControlProps = {
  className?: string;
  icon?: React.ReactNode;
  isIconOnly?: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'children' | 'className' | 'style'
>;

const ViewerControl = React.forwardRef<
  HTMLButtonElement,
  ViewerControlProps
>(
  (
    {
      className,
      icon,
      isIconOnly = false,
      isActive = false,
      children,
      ...props
    },
    ref,
  ) => (
    <AriaButton
      ref={ref}
      className={cn('viewer-control', className)}
      data-active={isActive ? 'true' : 'false'}
      data-icon-only={isIconOnly ? 'true' : 'false'}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </AriaButton>
  ),
);
ViewerControl.displayName = 'ViewerControl';

export type ViewerToolButtonProps = {
  className?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  size?: 'compact' | 'regular' | 'touch';
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'children' | 'className' | 'style'
>;

const ViewerToolButton = React.forwardRef<
  HTMLButtonElement,
  ViewerToolButtonProps
>(
  (
    { className, icon, isActive = false, size = 'regular', children, ...props },
    ref,
  ) => (
    <AriaButton
      ref={ref}
      className={cn('viewer-tool-button', className)}
      data-active={isActive ? 'true' : 'false'}
      data-size={size}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </AriaButton>
  ),
);
ViewerToolButton.displayName = 'ViewerToolButton';

export type ViewerSegmentedControlProps = {} & React.HTMLAttributes<HTMLDivElement>;

function ViewerSegmentedControl({
  className,
  ...props
}: ViewerSegmentedControlProps) {
  return (
    <div
      className={cn('viewer-segmented-control', className)}
      {...props}
    />
  );
}

export type ViewerSegmentProps = {
  className?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'children' | 'className' | 'style'
>;

const ViewerSegment = React.forwardRef<
  HTMLButtonElement,
  ViewerSegmentProps
>(({ className, icon, isActive = false, children, ...props }, ref) => (
  <AriaButton
    ref={ref}
    className={cn('viewer-segment', className)}
    data-active={isActive ? 'true' : 'false'}
    {...props}
  >
    {icon}
    {children && <span>{children}</span>}
  </AriaButton>
));
ViewerSegment.displayName = 'ViewerSegment';

export type ViewerToggleGroupProps = {
  className?: string;
  size?: 'compact' | 'regular';
  children?: React.ReactNode;
} & Omit<
  AriaToggleButtonGroupProps,
  'className' | 'style'
>;

function ViewerToggleGroup({
  className,
  size = 'regular',
  children,
  ...props
}: ViewerToggleGroupProps) {
  return (
    <AriaToggleButtonGroup
      className={cn('viewer-toggle-group', className)}
      data-size={size}
      {...props}
    >
      {children}
    </AriaToggleButtonGroup>
  );
}

export type ViewerToggleProps = {
  className?: string;
  icon?: React.ReactNode;
  size?: 'compact' | 'regular';
  children?: React.ReactNode;
} & Omit<
  AriaToggleButtonProps,
  'children' | 'className' | 'style'
>;

const ViewerToggle = React.forwardRef<
  HTMLButtonElement,
  ViewerToggleProps
>(({ className, icon, size = 'regular', children, ...props }, ref) => (
  <AriaToggleButton
    ref={ref}
    className={cn('viewer-toggle', className)}
    data-size={size}
    {...props}
  >
    {icon}
    {children && <span>{children}</span>}
  </AriaToggleButton>
));
ViewerToggle.displayName =
  'ViewerToggle';

export type ViewerCheckboxProps = {
  className?: string;
  indicatorClassName?: string;
  children?: React.ReactNode;
} & Omit<
  AriaCheckboxProps,
  'children' | 'className' | 'style'
>;

const ViewerCheckbox = React.forwardRef<
  HTMLLabelElement,
  ViewerCheckboxProps
>(({ className, indicatorClassName, children, ...props }, ref) => (
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  <AriaCheckbox
    ref={ref}
    className={cn('viewer-checkbox', className)}
    {...props}
  >
    {({ isIndeterminate }) => (
      <>
        <span
          className={indicatorClassName}
          aria-hidden="true"
          data-slot="indicator"
        >
          {isIndeterminate ? (
            <span data-slot="indeterminate" />
          ) : (
            <svg
              data-slot="check"
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
ViewerCheckbox.displayName = 'ViewerCheckbox';

export type ViewerNumberFieldProps = {
  className?: string;
  inputClassName?: string;
  suffix?: React.ReactNode;
  digits?: number;
} & Omit<
  AriaNumberFieldProps,
  'children' | 'className' | 'style' | 'formatOptions'
>;

const ViewerNumberField = React.forwardRef<
  HTMLDivElement,
  ViewerNumberFieldProps
>(
  (
    {
      className,
      inputClassName,
      suffix,
      digits,
      minValue = 1,
      step = 1,
      value,
      ...props
    },
    ref,
  ) => {
    const widthDigits =
      digits ??
      Math.max(
        String(props.maxValue ?? value ?? minValue).length,
        String(value ?? minValue).length,
      );

    return (
      <AriaNumberField
        ref={ref}
        className={cn('viewer-number-field', className)}
        minValue={minValue}
        step={step}
        value={value}
        {...props}
      >
        <AriaInput
          className={inputClassName}
          data-slot="input"
          style={{ width: `${widthDigits + 0.5}ch` }}
        />
        {suffix && (
          <span data-slot="suffix">
            {suffix}
          </span>
        )}
      </AriaNumberField>
    );
  },
);
ViewerNumberField.displayName = 'ViewerNumberField';

export type ViewerRailButtonProps = {
  className?: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  isActive?: boolean;
  variant?: 'default' | 'accent';
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'children' | 'className' | 'style'
>;

const ViewerRailButton = React.forwardRef<
  HTMLButtonElement,
  ViewerRailButtonProps
>(
  (
    {
      className,
      icon,
      label,
      isActive = false,
      variant = 'default',
      children,
      ...props
    },
    ref,
  ) => (
    <AriaButton
      ref={ref}
      className={cn('viewer-rail-button', className)}
      data-active={isActive ? 'true' : 'false'}
      data-variant={variant}
      {...props}
    >
      {icon && <span data-slot="icon">{icon}</span>}
      {label && (
        <span data-slot="label">{label}</span>
      )}
      {children}
    </AriaButton>
  ),
);
ViewerRailButton.displayName = 'ViewerRailButton';

export function ContentWarningControl({
  warning,
  isOpen,
  onOpenChange,
}: {
  warning: {
    title: string;
    body: string;
    linkLabel: string;
  };
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [isHoverPreviewOpen, setIsHoverPreviewOpen] = React.useState(false);
  const isPopoverOpen = isOpen || isHoverPreviewOpen;

  return (
    <div className="content-warning">
      <ViewerToolButton
        aria-label={isOpen ? 'Hide content warning' : 'Show content warning'}
        data-slot="button"
        icon={
          <IconContentWarning data-slot="icon" />
        }
        isActive={isOpen}
        onBlur={() => setIsHoverPreviewOpen(false)}
        onFocus={() => setIsHoverPreviewOpen(true)}
        onMouseEnter={() => setIsHoverPreviewOpen(true)}
        onMouseLeave={() => setIsHoverPreviewOpen(false)}
        onPress={() => onOpenChange(!isOpen)}
        size="compact"
      >
        {warning.title}
      </ViewerToolButton>
      {isPopoverOpen && (
        <div
          data-slot="popover"
          role="dialog"
          aria-label={warning.title}
        >
          <p>{warning.body}</p>
          <a href="#">
            <span>{warning.linkLabel}</span>
            <IconArrowTopRight
              aria-hidden="true"
              data-slot="link-icon"
            />
          </a>
        </div>
      )}
    </div>
  );
}

export {
  ViewerCheckbox,
  ViewerControl,
  ViewerNumberField,
  ViewerRailButton,
  ViewerSegment,
  ViewerSegmentedControl,
  ViewerToggleGroup,
  ViewerToggle,
  ViewerToolButton,
};
