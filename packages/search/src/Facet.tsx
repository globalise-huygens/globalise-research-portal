import { type ReactNode, useContext } from 'react';
import { IconRight } from '@globalise/design';
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
    <div className={classes.header} aria-label={`Facet for ${label}`}>
      <div className={classes.label} tabIndex={0}>
        {label}
      </div>

      <div className={classes.buttons}>
        <Button slot="trigger"
          aria-label={isExpanded ? 'Close' : 'Open'}
          className={`${classes.toggle} ${!isExpanded ? classes.expanded : ''}`}>
          <IconRight/>
        </Button>
      </div>
    </div>
  );
}
