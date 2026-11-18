import { EntityIcon, PreviewCard, type EntityPreviewCardData } from '@globalise/design';

type ClassificationPreviewProps = {
  label: string;
  data: EntityPreviewCardData;
};

export function ClassificationPreview({ label, data }: ClassificationPreviewProps) {
  return (
    <PreviewCard data={data}>
      {(attributes) => (
        <button {...attributes} type="button" className="manifest-preview-link">
          <span>{label}</span>
          <EntityIcon type="classification" />
        </button>
      )}
    </PreviewCard>
  );
}
