import { cn } from '../../lib';
import { IconExpandSection } from '../icons';

export type ExpandCollapseIconProps = {
  isExpanded: boolean;
  className?: string;
};

export function ExpandCollapseIcon({ isExpanded, className }: ExpandCollapseIconProps) {
  return (
    <IconExpandSection
      aria-hidden="true"
      className={cn('expand-collapse-icon', isExpanded && 'expanded', className)}
    />
  );
}
