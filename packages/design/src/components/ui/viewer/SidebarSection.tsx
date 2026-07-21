import { cn } from '../../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';

export type ViewerSidebarSectionProps = {
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

function ViewerSidebarSection({
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
}: ViewerSidebarSectionProps) {
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
    <section className={cn('viewer-sidebar-section', className)} {...props}>
      <AriaButton
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="button"
        onPress={() => setExpanded(!isExpanded)}
        {...buttonProps}
      >
        <span className="button-content">
          {icon && <span className="icon">{icon}</span>}
          <span className="title">{title}</span>
          {count && (
            <span className="count">{count}</span>
          )}
        </span>
        {trailing}
      </AriaButton>
      {isExpanded && (
        <div id={panelId} className="panel">
          {children}
        </div>
      )}
    </section>
  );
}

export { ViewerSidebarSection };
