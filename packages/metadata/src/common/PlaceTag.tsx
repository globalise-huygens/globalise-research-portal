import { IconEntityPlace } from '@globalise/design';

export type PlaceTagProps = {
  label: string;
  href?: string;
};

export function PlaceTag({ label, href }: PlaceTagProps) {

  const labelWithIcon = <><span className="label">{label}</span>
    <span className="icon" aria-hidden="true">
      <IconEntityPlace className="icon-svg"/>
    </span></>;

  if(!href) {
    return <span className="entity-tag" data-type="place">{labelWithIcon}</span>;
  }

  return (
    <a
      data-type="place"
      className="entity-tag"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {labelWithIcon}
    </a>
  );
}
