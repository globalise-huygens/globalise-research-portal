import { type ReactNode, useContext } from 'react';
import { IconExpandSection } from '@globalise/design';
import { Disclosure, DisclosurePanel, Button, DisclosureStateContext } from 'react-aria-components';
import classes from './Facet.module.css';

export type FacetProps = {
  label: string;
  infoText?: string;
  startOpen?: boolean;
  allowToggle?: boolean;
  children: ReactNode;
};

export default function Facet({ label, children }: FacetProps) {
  return (
    <Disclosure className={classes.facet} aria-label={`Facet for ${label}`} defaultExpanded>
      <FacetHeader label={label}/>

      <DisclosurePanel className={classes.body}>
        {children}
      </DisclosurePanel>
    </Disclosure>
  );
}

function FacetHeader({ label }: { label: string }) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { isExpanded } = useContext(DisclosureStateContext)!;

  return (
    <Button slot="trigger" aria-label={isExpanded ? 'Close' : 'Open'} className={classes.header}>
      <span className={classes.label}>
        {label}
      </span>

      <IconExpandSection/>
    </Button>
  );
}
