import { type ReactNode, useContext } from 'react';
import { IconExpandSection, Spinner, cn } from '@globalise/design';
import { Disclosure, DisclosurePanel, Button, DisclosureStateContext } from 'react-aria-components';
import classes from './Facet.module.css';

export type FacetProps = {
  label: string;
  infoText?: string;
  startOpen?: boolean;
  allowToggle?: boolean;
  isPending?: boolean;
  children: ReactNode;
};

export default function Facet({ label, isPending = false, children }: FacetProps) {
  return (
    <Disclosure className={classes.facet} aria-label={`Facet for ${label}`} defaultExpanded>
      <FacetHeader label={label} isPending={isPending}/>

      <DisclosurePanel className={classes.body}>
        <div className={classes.content}>
          {children}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

function FacetHeader({ label, isPending }: { label: string, isPending: boolean }) {
  const { isExpanded } = useContext(DisclosureStateContext)!;

  return (
    <Button slot="trigger" aria-label={isExpanded ? 'Close' : 'Open'} className={classes.header}>
      <span className={classes.label}>
        {label}
        <Spinner className={cn(classes.spinner, isPending && classes.pending)}/>
      </span>

      <IconExpandSection/>
    </Button>
  );
}
