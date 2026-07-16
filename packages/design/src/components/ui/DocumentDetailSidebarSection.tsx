import { cn } from '../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';

export type DocumentDetailSidebarSectionProps = {
  title: React.ReactNode;
  icon?: React.ReactNode;
  count?: React.ReactNode;
  trailing?: React.ReactNode;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  buttonProps?: Omit<AriaButtonProps, 'children' | 'className' | 'style'>;
} & Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
>;

function DocumentDetailSidebarSection({
  className,
  title,
  icon,
  count,
  trailing,
  defaultExpanded = false,
  isExpanded: controlledExpanded,
  onExpandedChange,
  buttonProps,
  children,
  ...props
}: DocumentDetailSidebarSectionProps) {
  const panelId = React.useId();
  const [uncontrolledExpanded, setUncontrolledExpanded] =
    React.useState(defaultExpanded);
  const isExpanded = controlledExpanded ?? uncontrolledExpanded;

  const setExpanded = (nextExpanded: boolean) => {
    if (controlledExpanded === undefined) {
      setUncontrolledExpanded(nextExpanded);
    }

    onExpandedChange?.(nextExpanded);
  };

  return (
    <section className={cn('document-sidebar-section', className)} {...props}>
      <AriaButton
        aria-expanded={isExpanded}
        aria-controls={panelId}
        data-slot="button"
        onPress={() => setExpanded(!isExpanded)}
        {...buttonProps}
      >
        <span data-slot="button-content">
          {icon && <span data-slot="icon">{icon}</span>}
          <span data-slot="title">{title}</span>
          {count && (
            <span data-slot="count">{count}</span>
          )}
        </span>
        {trailing}
      </AriaButton>
      {isExpanded && (
        <div id={panelId} data-slot="panel">
          {children}
        </div>
      )}
    </section>
  );
}

export { DocumentDetailSidebarSection };
