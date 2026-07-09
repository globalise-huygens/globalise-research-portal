import { Fragment, ReactNode } from 'react';

export type JoinedProps = {
  separator?: ReactNode;
  children: ReactNode[];
};

export function Joined(
  { children, separator = ', ' }: JoinedProps
) {
  return (
    <>
      {children.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && separator}
          {item}
        </Fragment>
      ))}
    </>
  );
}
