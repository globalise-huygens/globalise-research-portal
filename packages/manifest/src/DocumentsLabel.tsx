import { Fragment } from 'react';
import type { ManifestDocument } from '@globalise/metadata';
import { DocumentLabel } from './DocumentLabel.tsx';
import { Separator } from './Separator.tsx';
import { limitLabelDocuments } from './limitLabelDocuments.ts';

type Props = {
  boundaries: ManifestDocument[];
  others?: ManifestDocument[];
  maxDocuments?: number;
};

export function DocumentsLabel(
  {
    boundaries,
    others = [],
    maxDocuments = 3,
  }: Props,
) {
  const {
    shown,
    hidden,
    hidesBoundary,
  } = limitLabelDocuments(boundaries, others, maxDocuments);

  if (!shown.length) {
    return null;
  }

  return (
    <span className="documents">
      {shown.map((document, index) => {
        const isBoundary = boundaries.includes(document);
        return (
          <Fragment key={document.id}>
            {index > 0 && <Separator isBoundary={isBoundary}/>}
            <DocumentLabel document={document} isBoundary={isBoundary}/>
          </Fragment>
        );
      })}
      {hidden.length > 0 && (
        <>
          <Separator isBoundary={hidesBoundary}/>
          <span
            className="document more-documents"
            data-boundary={hidesBoundary ? 'true' : undefined}
            title={hidden.map((document) => document.label).join('\n')}
          >
            (+{hidden.length})
          </span>
        </>
      )}
    </span>
  );
}
