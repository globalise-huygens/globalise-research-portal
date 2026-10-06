import type { ManifestDocument } from '@globalise/metadata';
import { TruncatedTitle } from './TruncatedTitle.tsx';

type Props = {
  document: ManifestDocument;
  isBoundary?: boolean;
};

export function DocumentLabel({ document, isBoundary = false }: Props) {
  return (
    <span
      className="document"
      data-boundary={isBoundary ? 'true' : undefined}
      title={`document: ${document.label}`}
    >
      {isBoundary && <span className="arrow"/>}
      <TruncatedTitle text={document.label}/>
    </span>
  );
}
