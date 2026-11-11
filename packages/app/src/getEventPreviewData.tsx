import {
  getEventBody,
  type Annotation,
  type EventBody,
} from '@globalise/common/annotation';
import {
  EntityIcon,
  type EntityPreviewCardData,
  IconExternalLink,
} from '@globalise/design';
import { ClassificationPreview } from './ClassificationPreview.tsx';

export function getEventPreviewData(annotation: Annotation<EventBody>): EntityPreviewCardData {
  const body = getEventBody(annotation);
  const classifiedBy = (
    <ClassificationPreview
      label={body.classified_as._label}
      data={getEventClassificationPreviewData(body)}
    />
  );

  return {
    type: 'event',
    icon: <EntityIcon type="event" />,
    title: body._label,
    properties: [
      { label: 'Event type', value: body.type },
      { label: 'Classified by', value: classifiedBy },
    ],
  };
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
