import { createContext } from 'react';

export const ViewerDisplayContext = createContext({
  showScanNumbers: true,
  showDocumentBoundaries: true,
  setShowScanNumbers: (_visible: boolean): void => undefined,
  setShowDocumentBoundaries: (_visible: boolean): void => undefined,
});
