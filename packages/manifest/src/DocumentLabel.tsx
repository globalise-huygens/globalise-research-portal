import type { ManifestDocument } from '@globalise/metadata';
import { TruncatedTitle } from './TruncatedTitle.tsx';

type Props = {
  document: ManifestDocument;
  isEdge?: boolean;
};

export function DocumentLabel({ document, isEdge = false }: Props) {
  return (
    <span
      className="document"
      data-edge={isEdge ? 'true' : undefined}
      title={`document: ${document.label}`}
    >
      {isEdge && <span className="arrow"/>}
      <TruncatedTitle text={document.label}/>
    </span>
  );
}
