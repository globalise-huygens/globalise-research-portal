import { Link } from '@tanstack/react-router';

export function Home() {
  return (<>
    <h1>Globalise</h1>
    <ul>
      <li><Link to="/search">Search</Link></li>
      <li><Link to="/manifest">Manifest viewer</Link></li>
      <li><Link to="/object-card">Object card</Link></li>
    </ul>
  </>
  );
}
