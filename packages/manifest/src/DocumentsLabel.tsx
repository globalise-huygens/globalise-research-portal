import { Fragment } from 'react';
import type { ManifestDocument } from '@globalise/metadata';
import { DocumentLabel } from './DocumentLabel.tsx';
import { Separator } from './Separator.tsx';
import { limitLabelDocuments } from './limitLabelDocuments.ts';

type Props = {
  edges: ManifestDocument[];
  others?: ManifestDocument[];
  maxDocuments?: number;
};

export function DocumentsLabel(
  {
    edges,
    others = [],
    maxDocuments = 3,
  }: Props,
) {
  const {
    shown,
    hidden,
    hidesEdge,
  } = limitLabelDocuments(edges, others, maxDocuments);

  if (!shown.length) {
    return null;
  }

  return (
    <span className="documents">
      {shown.map((document, index) => {
        const isEdge = edges.includes(document);
        return (
          <Fragment key={document.id}>
            {index > 0 && <Separator isEdge={isEdge}/>}
            <DocumentLabel document={document} isEdge={isEdge}/>
          </Fragment>
        );
      })}
      {hidden.length > 0 && (
        <>
          <Separator isEdge={hidesEdge}/>
          <span
            className="document more-documents"
            data-edge={hidesEdge ? 'true' : undefined}
            title={hidden.map((document) => document.label).join('\n')}
          >
            (+{hidden.length})
          </span>
        </>
      )}
    </span>
  );
}
