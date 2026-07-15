import { Search } from '@globalise/search';
import { Link } from '@tanstack/react-router';

export function Home() {
  return (<>
    <h1>Globalise</h1>
    <ul>
      <li><Search/></li>
      <li><Link to="/manifest">Manifest viewer</Link></li>
    </ul>
  </>
  );
}
