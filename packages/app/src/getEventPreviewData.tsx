import {
  getEventBody,
  type Annotation,
  type EventBody,
  type EventClassification,
} from '@globalise/common/annotation';
import {
  EntityIcon,
  type EntityPreviewCardData,
  IconExternalLink,
} from '@globalise/design';
import { ClassificationPreview } from './ClassificationPreview.tsx';

export function getEventPreviewData(annotation: Annotation<EventBody>): EntityPreviewCardData {
  const body = getEventBody(annotation);
  const classifiedAsLabels = getNestedClassifiedAsLabels(body.classified_as);
  const eventType = (
    <>
      <ClassificationPreview
        label={body.classified_as._label}
        data={getEventClassificationPreviewData(body)}
      />
      {classifiedAsLabels.map((label) => ` > ${label}`)}
    </>
  );

  const properties = [
    { label: 'Event type', value: eventType },
  ];

  return {
    type: 'event',
    icon: <EntityIcon type="event" />,
    title: 'Event',
    properties,
  };
}

function getNestedClassifiedAsLabels(
  classification: EventClassification,
): string[] {
  const child = classification.classified_as;
  if (!child) {
    return [];
  }
  return [
    child._label,
    ...getNestedClassifiedAsLabels(child),
  ];
}

function getEventClassificationPreviewData(body: EventBody): EntityPreviewCardData {
  const { id, _label } = body.classified_as;
  const definition = (
    <a href={id} target="_blank" rel="noreferrer" className="manifest-preview-link">
      Event typology
      <IconExternalLink />
    </a>
  );

  return {
    type: 'classification',
    icon: <EntityIcon type="classification" />,
    title: _label,
    properties: [
      { label: 'Type', value: 'Event classification' },
      { label: 'Definition', value: definition },
    ],
  };
}
