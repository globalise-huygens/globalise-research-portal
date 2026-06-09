import {ReactNode} from 'react';
import {HeaderBar} from './Header';

import './SinglePaneLayout.css';

type SinglePaneLayoutProps = {
  children: ReactNode;
};

export function SinglePaneLayout({children}: SinglePaneLayoutProps) {
  return (
    <div className="single-pane-layout">
      <div className="single-pane-content">
        {children}
      </div>
    </div>
  );
}