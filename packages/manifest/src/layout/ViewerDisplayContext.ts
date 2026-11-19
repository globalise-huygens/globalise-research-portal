import { createContext } from 'react';

export const ViewerDisplayContext = createContext({
  showScanNumbers: true,
  showDocumentStarts: true,
  setShowScanNumbers: (_visible: boolean): void => undefined,
  setShowDocumentStarts: (_visible: boolean): void => undefined,
});
