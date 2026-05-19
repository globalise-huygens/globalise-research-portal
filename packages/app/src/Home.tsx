import {Design} from "@globalise/design";
import {Search} from "@globalise/search";
import {Link} from "@tanstack/react-router";

export function Home() {
  return (<>
      <h1>Globalise</h1>
      <ul>
        <li><Design/></li>
        <li><Search/></li>
        <li><Link to="/document">Document</Link></li>
        <li><Link to="/manifest/facsimile">Manifest facsimile viewer</Link></li>
        <li><Link to="/manifest/transcription">Manifest transcription viewer</Link></li>
      </ul>
    </>
  );
}