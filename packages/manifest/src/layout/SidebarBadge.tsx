import { ReactNode } from 'react';
import { IconEntityDocument } from '@globalise/design';
import { useSelectedDocument } from '@globalise/metadata';

type SidebarBadgeProps = {
  label: string;
  title?: string;
  icon?: ReactNode;
};

export function SidebarBadge({ label, title = label, icon }: SidebarBadgeProps) {
  return (
    <span className="badge" title={title}>
      {icon}
      <span className="badge-label">{label}</span>
    </span>
  );
}

export function DocumentBadge() {
  const document = useSelectedDocument();
  if (!document) {
    return null;
  }
  return (
    <SidebarBadge
      label={document.label}
      title={`Document: ${document.label}`}
      icon={<IconEntityDocument className="badge-icon" aria-hidden="true"/>}
    />
  );
}
