import {Design} from "@globalise/design";
import {Search} from "@globalise/search";
import {DocumentPage} from "./DocumentPage.tsx";

const url = new URL(window.location.href);
const showDocument = url.searchParams.has('document');

export function App() {
  return (<>
      {!showDocument && <div>
        <h1>Globalise</h1>
        <Design/>
        <Search/>
        <a href="?document">Document</a>
      </div>
      }
      {showDocument && <DocumentPage/>}
    </>
  );
}
