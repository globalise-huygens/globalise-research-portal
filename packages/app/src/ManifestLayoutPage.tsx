import { ManifestDocumentPageLayout } from '@globalise/manifest/layout';
import { ManifestLoader } from '@globalise/facsimile';
import { ViewerProvider } from '@knaw-huc/osd-iiif-viewer';

const manifestUrl = 'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:1053.manifest';

export function ManifestLayoutPage() {
  return <ViewerProvider>
    <ManifestLoader url={manifestUrl}>
      <ManifestDocumentPageLayout/>
    </ManifestLoader>
  </ViewerProvider>;
}