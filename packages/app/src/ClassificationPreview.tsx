import { EntityTag, PreviewCard, type EntityPreviewCardData } from '@globalise/design';

type ClassificationPreviewProps = {
  label: string;
  data: EntityPreviewCardData;
};

export function ClassificationPreview({ label, data }: ClassificationPreviewProps) {
  return (
    <PreviewCard data={data}>
      {(attributes) => (
        <button {...attributes} type="button" className="manifest-preview-link">
          <EntityTag type="concept">{label}</EntityTag>
        </button>
      )}
    </PreviewCard>
  );
}
