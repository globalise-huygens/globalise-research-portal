import './ControlBar.css';
import { type ReactNode } from 'react';

type ControlBarProps = {
  children: ReactNode;
  className?: string;
};

export function ControlBar({ children, className }: ControlBarProps) {
  const classes = className ? `control-bar ${className}` : 'control-bar';
  return <div className={classes}>{children}</div>;
}
