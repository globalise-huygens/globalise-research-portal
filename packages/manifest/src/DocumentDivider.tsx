import { IconEntityDocument } from '@globalise/design';
import type { ManifestDocument } from '@globalise/metadata';
import './DocumentDivider.css';

type Props = { documents?: ManifestDocument[] };

export function DocumentDivider({ documents = [] }: Props) {
  return documents.map((document) => (
    <div className="document-divider" key={document.id}>
      <IconEntityDocument aria-hidden="true"/>
      <span className="document-divider-title">{document.label}</span>
      <span className="document-divider-count">
        {document.scans.length} {document.scans.length === 1 ? 'scan' : 'scans'}
      </span>
    </div>
  ));
}
