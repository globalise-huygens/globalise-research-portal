import { Link } from 'react-aria-components';
import { toHref } from '@globalise/router';

export function Home() {
  return (<>
    <h1>Globalise</h1>
    <ul>
      <li><Link href={toHref({ to: '/search' })}>Search</Link></li>
      <li><Link href={toHref({ to: '/manifest' })}>Manifest viewer</Link></li>
      <li><Link href={toHref({ to: '/catalog' })}>Catalog</Link></li>
      <li><Link href={toHref({ to: '/object-card' })}>Object card</Link></li>
      <li><Link href={toHref({ to: '/map' })}>World map</Link></li>
    </ul>
  </>
  );
}
