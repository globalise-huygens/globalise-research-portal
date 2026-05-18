import {Design} from "@globalise/design";
import {Search} from "@globalise/search";

export function Home() {
  return (<>
      <h1>Globalise</h1>
      <Design/>
      <Search/>
      <a href="/document">Document</a>
    </>
  );
}