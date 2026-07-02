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
    <section
      className={cn('gds-document-detail-sidebar-section', className)}
      {...props}
    >
      <AriaButton
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="gds-document-detail-sidebar-section__button"
        onPress={() => setExpanded(!isExpanded)}
        {...buttonProps}
      >
        <span className="gds-document-detail-sidebar-section__button-content">
          {icon && <span className="gds-document-detail-icon">{icon}</span>}
          <span className="gds-document-detail-sidebar-section__title">
            {title}
          </span>
          {count && (
            <span className="gds-document-detail-sidebar-section__count">
              {count}
            </span>
          )}
        </span>
        {trailing}
      </AriaButton>
      {isExpanded && (
        <div
          id={panelId}
          className="gds-document-detail-sidebar-section__panel"
        >
          {children}
        </div>
      )}
    </section>
  );
}

export { DocumentDetailSidebarSection };
