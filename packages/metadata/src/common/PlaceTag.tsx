import { IconEntityPlace } from '@globalise/design';
import { toHref } from '@globalise/router';

export type PlaceTagProps = {
  label: string;
  href?: string;
};

export function PlaceTag({ label, href }: PlaceTagProps) {

  const labelWithIcon = <><span className="label">{label}</span>
    &nbsp;
    <span className="icon" aria-hidden="true">
      <IconEntityPlace className="icon-svg"/>
    </span></>;

  if(!href) {
    return <span className="entity-tag" data-type="place">{labelWithIcon}</span>;
  }

  const isInternalPlace = href.startsWith('https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/place:');
  return (
    <a
      data-type="place"
      className="entity-tag"
      href={isInternalPlace ? toHref({ to: '/object-card', search: { uri: href } }) : href}
      target={isInternalPlace ? undefined : '_blank'}
      rel={isInternalPlace ? undefined : 'noopener noreferrer'}
    >
      {labelWithIcon}
    </a>
  );
}
