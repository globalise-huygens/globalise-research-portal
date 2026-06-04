import {ReactNode} from 'react';
import './Page.css';

type PageProps = {
  header?: ReactNode;
  children: ReactNode;
};

export function Page({header, children}: PageProps) {
  return (
    <div className="page">
      <header>{header}</header>
      <main>{children}</main>
    </div>
  );
}