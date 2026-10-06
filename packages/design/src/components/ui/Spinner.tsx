import { cn } from '../../lib';
import { IconProgressActivity } from '../icons';

export type SpinnerProps = {
  className?: string;
};

export function Spinner({ className }: SpinnerProps) {
  return <IconProgressActivity className={cn('spinner', className)} aria-hidden="true"/>;
}
