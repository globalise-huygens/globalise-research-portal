import { Search } from '@globalise/search';
import { Link } from '@tanstack/react-router';

export function Home() {
  return (<>
    <h1>Globalise</h1>
    <ul>
      <li><Search/></li>
      <li><Link to="/document">Document</Link></li>
      <li><Link to="/manifest">Manifest document viewer</Link></li>
      <li><Link to="/manifest/layout">Manifest document layout</Link></li>
      <li><Link to="/manifest/facsimile">Manifest facsimile viewer</Link></li>
      <li><Link to="/manifest/transcription">Manifest transcription viewer</Link></li>
      <li><Link to="/metadata">Metadata</Link></li>
    </ul>
  </>
  );
}
