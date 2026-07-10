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
import type { DocumentDetailOverlayContent } from './DocumentDetailOverlayTypes';
import { IconArrowTopRight } from '../icons/IconArrowTopRight';
import { IconContentWarning } from '../icons/IconContentWarning';
import { DocumentDetailTooltip } from './DocumentDetailSurfaces';

export type DocumentDetailControlProps = {
  className?: string;
  icon?: React.ReactNode;
  isIconOnly?: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'children' | 'className' | 'style'
>;

const DocumentDetailControl = React.forwardRef<
  HTMLButtonElement,
  DocumentDetailControlProps
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
      className={cn('gds-document-detail-control', className)}
      data-active={isActive ? 'true' : 'false'}
      data-icon-only={isIconOnly ? 'true' : 'false'}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </AriaButton>
  ),
);
DocumentDetailControl.displayName = 'DocumentDetailControl';

export type DocumentDetailToolButtonProps = {
  className?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  size?: 'compact' | 'regular' | 'touch';
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'children' | 'className' | 'style'
>;

const DocumentDetailToolButton = React.forwardRef<
  HTMLButtonElement,
  DocumentDetailToolButtonProps
>(
  (
    { className, icon, isActive = false, size = 'regular', children, ...props },
    ref,
  ) => (
    <AriaButton
      ref={ref}
      className={cn('gds-document-detail-tool-button', className)}
      data-active={isActive ? 'true' : 'false'}
      data-size={size}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </AriaButton>
  ),
);
DocumentDetailToolButton.displayName = 'DocumentDetailToolButton';

export type DocumentDetailSegmentedControlProps = {} & React.HTMLAttributes<HTMLDivElement>;

function DocumentDetailSegmentedControl({
  className,
  ...props
}: DocumentDetailSegmentedControlProps) {
  return (
    <div
      className={cn('gds-document-detail-segmented-control', className)}
      {...props}
    />
  );
}

export type DocumentDetailSegmentProps = {
  className?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  children?: React.ReactNode;
} & Omit<
  AriaButtonProps,
  'children' | 'className' | 'style'
>;

const DocumentDetailSegment = React.forwardRef<
  HTMLButtonElement,
  DocumentDetailSegmentProps
>(({ className, icon, isActive = false, children, ...props }, ref) => (
  <AriaButton
    ref={ref}
    className={cn('gds-document-detail-segment', className)}
    data-active={isActive ? 'true' : 'false'}
    {...props}
  >
    {icon}
    {children && <span>{children}</span>}
  </AriaButton>
));
DocumentDetailSegment.displayName = 'DocumentDetailSegment';

export type DocumentDetailSegmentedToggleGroupProps = {
  className?: string;
  size?: 'compact' | 'regular';
  children?: React.ReactNode;
} & Omit<
  AriaToggleButtonGroupProps,
  'className' | 'style'
>;

function DocumentDetailSegmentedToggleGroup({
  className,
  size = 'regular',
  children,
  ...props
}: DocumentDetailSegmentedToggleGroupProps) {
  return (
    <AriaToggleButtonGroup
      className={cn('gds-document-detail-segmented-toggle-group', className)}
      data-size={size}
      {...props}
    >
      {children}
    </AriaToggleButtonGroup>
  );
}

export type DocumentDetailSegmentedToggleItemProps = {
  className?: string;
  icon?: React.ReactNode;
  size?: 'compact' | 'regular';
  children?: React.ReactNode;
} & Omit<
  AriaToggleButtonProps,
  'children' | 'className' | 'style'
>;

const DocumentDetailSegmentedToggleItem = React.forwardRef<
  HTMLButtonElement,
  DocumentDetailSegmentedToggleItemProps
>(({ className, icon, size = 'regular', children, ...props }, ref) => (
  <AriaToggleButton
    ref={ref}
    className={cn('gds-document-detail-segmented-toggle-item', className)}
    data-size={size}
    {...props}
  >
    {icon}
    {children && <span>{children}</span>}
  </AriaToggleButton>
));
DocumentDetailSegmentedToggleItem.displayName =
  'DocumentDetailSegmentedToggleItem';

export type DocumentDetailCheckboxProps = {
  className?: string;
  indicatorClassName?: string;
  children?: React.ReactNode;
} & Omit<
  AriaCheckboxProps,
  'children' | 'className' | 'style'
>;

const DocumentDetailCheckbox = React.forwardRef<
  HTMLLabelElement,
  DocumentDetailCheckboxProps
>(({ className, indicatorClassName, children, ...props }, ref) => (
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  <AriaCheckbox
    ref={ref}
    className={cn('gds-document-detail-checkbox', className)}
    {...props}
  >
    {() => (
      <>
        <span
          className={cn(
            'gds-document-detail-checkbox__indicator',
            indicatorClassName,
          )}
          aria-hidden="true"
        />
        {children && <span>{children}</span>}
      </>
    )}
  </AriaCheckbox>
));
DocumentDetailCheckbox.displayName = 'DocumentDetailCheckbox';

export type DocumentDetailNumberFieldProps = {
  className?: string;
  inputClassName?: string;
  suffix?: React.ReactNode;
  digits?: number;
} & Omit<
  AriaNumberFieldProps,
  'children' | 'className' | 'style' | 'formatOptions'
>;

const DocumentDetailNumberField = React.forwardRef<
  HTMLDivElement,
  DocumentDetailNumberFieldProps
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
        className={cn('gds-document-detail-number-field', className)}
        minValue={minValue}
        step={step}
        value={value}
        {...props}
      >
        <AriaInput
          className={cn(
            'gds-document-detail-number-field__input',
            inputClassName,
          )}
          style={{ width: `${widthDigits + 0.5}ch` }}
        />
        {suffix && (
          <span className="gds-document-detail-number-field__suffix">
            {suffix}
          </span>
        )}
      </AriaNumberField>
    );
  },
);
DocumentDetailNumberField.displayName = 'DocumentDetailNumberField';

export type DocumentDetailRailButtonProps = {
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

const DocumentDetailRailButton = React.forwardRef<
  HTMLButtonElement,
  DocumentDetailRailButtonProps
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
      className={cn('gds-document-detail-rail-button', className)}
      data-active={isActive ? 'true' : 'false'}
      data-variant={variant}
      {...props}
    >
      {icon}
      {label && (
        <span className="gds-document-detail-rail-button__label">{label}</span>
      )}
      {children}
    </AriaButton>
  ),
);
DocumentDetailRailButton.displayName = 'DocumentDetailRailButton';

export type DocumentDetailIconButtonProps = {
  'aria-label': string;
  tooltip?: React.ReactNode;
  icon: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  variant?: 'chrome' | 'quiet';
};

function DocumentDetailIconButton({
  'aria-label': ariaLabel,
  tooltip,
  icon,
  isActive,
  isDisabled,
  onPress,
  variant = 'chrome',
}: DocumentDetailIconButtonProps) {
  const button = (
    <DocumentDetailToolButton
      aria-label={ariaLabel}
      className={cn(
        'document-detail-overlay-icon-button',
        variant === 'quiet' && 'document-detail-overlay-icon-button--quiet',
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

  return (
    <DocumentDetailTooltip label={tooltip}>{button}</DocumentDetailTooltip>
  );
}

export function DocumentDetailZoomLabel({
  children = '100 %',
}: {
  children?: React.ReactNode;
}) {
  return (
    <DocumentDetailToolButton className="document-detail-overlay-zoom-label">
      {children}
    </DocumentDetailToolButton>
  );
}

export function ContentWarningControl({
  warning,
  isOpen,
  onOpenChange,
}: {
  warning: DocumentDetailOverlayContent['contentWarning'];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [isHoverPreviewOpen, setIsHoverPreviewOpen] = React.useState(false);
  const isPopoverOpen = isOpen || isHoverPreviewOpen;

  return (
    <div>
      <DocumentDetailToolButton
        aria-label={isOpen ? 'Hide content warning' : 'Show content warning'}
        className="document-detail-overlay-warning-button"
        icon={
          <IconContentWarning className="document-detail-overlay-icon-medium" />
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
      </DocumentDetailToolButton>
      {isPopoverOpen && (
        <div
          className="document-detail-overlay-warning-popover"
          role="dialog"
          aria-label={warning.title}
        >
          <p>{warning.body}</p>
          <a href="#">
            <span>{warning.linkLabel}</span>
            <IconArrowTopRight
              aria-hidden="true"
              className="document-detail-overlay-warning-link-icon"
            />
          </a>
        </div>
      )}
    </div>
  );
}

export {
  DocumentDetailCheckbox,
  DocumentDetailControl,
  DocumentDetailIconButton,
  DocumentDetailNumberField,
  DocumentDetailRailButton,
  DocumentDetailSegment,
  DocumentDetailSegmentedControl,
  DocumentDetailSegmentedToggleGroup,
  DocumentDetailSegmentedToggleItem,
  DocumentDetailToolButton,
};
