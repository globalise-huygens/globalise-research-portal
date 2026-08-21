import { JSX, ReactNode } from 'react';
import { EntityBadge, EntityTag, EntityTagType } from '@globalise/design';
import { DocumentSearchResult } from './Results';
import classes from './Result.module.css';

export type ResultProps = {
  type: EntityTagType;
  begin: string;
  end: string;
  title: string;
  subline: ReactNode[];
  children: ReactNode;
};

export default function Result({ type, begin, end, title, subline, children }: ResultProps): JSX.Element {
  return (
    <li className={classes.resultCard}>
      <div className={classes.aside}>
        <EntityBadge className={classes.badge} type={type}>
          <EntityTag type={type}/>
          {type}
        </EntityBadge>

        <div className={classes.labels}>
          <span className={classes.label}>beginning of the begin</span>
          <span>{begin}</span>

          <span>-</span>

          <span className={classes.label}>end of the end</span>
          <span>{end}</span>
        </div>
      </div>

      <div className={classes.main}>
        <h2>{title}</h2>

        <ul className={classes.subline}>
          {subline.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>

        {children}
      </div>
    </li>
  );
}

export function DocumentResultContent({ summary }: DocumentSearchResult) {
  return (
    <>
      <p>{summary}</p>

      <ul className={classes.mentions}>
        <li>Dag register der daagelijxe voor vallen gehouden, toot Casteel, de Poedes hoop</li>
        <li>Dag register der daagelijxe voor vallen gehouden, toot Casteel, de Poedes hoop</li>
        <li>Dag register der daagelijxe voor vallen gehouden, toot Casteel, de Poedes hoop</li>
      </ul>
    </>
  );
}
