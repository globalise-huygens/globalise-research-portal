import { IconEntityPlace } from '@globalise/design';

export type PlaceTagProps = {
  label: string;
  href?: string;
};

export function PlaceTag({ label, href }: PlaceTagProps) {

  const labelWithIcon = <><span className="gds-entity-tag__label">{label}</span>
    <span className="gds-entity-tag__icon" aria-hidden="true">
      <IconEntityPlace className="gds-entity-tag__icon-svg"/>
    </span></>;

  if(!href) {
    return labelWithIcon;
  }

  return (
    <a
      data-type="place"
      className="gds-entity-tag"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {labelWithIcon}
    </a>
  );
}
