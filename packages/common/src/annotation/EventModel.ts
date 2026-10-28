import { Annotation, Body } from './AnnoModel.ts';
import { asArray } from './asArray.ts';

export type EventBody = {
  id: string;
  type: string;
  _label: string;
  classified_as: EventClassification;
};

export type EventClassification = {
  id: string;
  type: string;
  _label: string;
};

const eventTypology = 'https://github.com/globalise-huygens/nlp-event-detection/wiki#';

export const isEventBody = (body: Body | undefined): body is EventBody => {
  const classificationId = (body as EventBody | undefined)?.classified_as?.id;
  return !!classificationId?.startsWith(eventTypology);
};

export const isEvent = (
  annotation: Annotation,
): annotation is Annotation<EventBody> => getEventBodies(annotation).length > 0;

export function getEventBodies(annotation: Annotation): EventBody[] {
  return asArray(annotation.body).filter(isEventBody);
}

export function getEventId(annotation: Annotation<EventBody>): string {
  return getEventBodies(annotation)[0].id;
}
