import type { ManifestDocument } from '@globalise/metadata';
import { TruncatedTitle } from './TruncatedTitle.tsx';

type Props = {
  document: ManifestDocument;
  isEdge?: boolean;
};

export function ChipDocument({ document, isEdge = false }: Props) {
  return (
    <span className="document" data-edge={isEdge ? 'true' : undefined}>
      {isEdge && <span className="arrow"/>}
      <TruncatedTitle text={document.label}/>
    </span>
  );
}
