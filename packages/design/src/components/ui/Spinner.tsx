import { VisuallyHidden } from 'react-aria-components';
import { cn } from '../../lib';
import { IconProgressActivity } from '../icons';

export type SpinnerProps = {
  label?: string;
  className?: string;
};

export function Spinner({ label, className }: SpinnerProps) {
  const icon = <IconProgressActivity className={cn('spinner', className)} aria-hidden="true"/>;

  if (!label) {
    return icon;
  }

  return (
    <span role="status">
      {icon}
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
}
