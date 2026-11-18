// The supported annotation types, by lowercase name. `type:place` finds Place annotations and
// `place:batavia` finds 'batavia' inside a Place annotation.
export const annotationTypeFields: Record<string, string> = {
  acquisition: 'Acquisition',
  actofauthority: 'ActOfAuthority',
  attack: 'Attack',
  correspondenceevent: 'CorrespondenceEvent',
  declarativeacquisition: 'DeclarativeAcquisition',
  declarativejoining: 'DeclarativeJoining',
  declarativeleaving: 'DeclarativeLeaving',
  destruction: 'Destruction',
  destructivephysicalmodification: 'DestructivePhysicalModification',
  dimension: 'Dimension',
  event: 'Event',
  exerciseofauthority: 'ExerciseOfAuthority',
  group: 'Group',
  humanmadeobject: 'HumanMadeObject',
  intentionaldestruction: 'IntentionalDestruction',
  internalchange: 'InternalChange',
  internalstate: 'InternalState',
  move: 'Move',
  obligationstatus: 'ObligationStatus',
  ownershipstatus: 'OwnershipStatus',
  payment: 'Payment',
  persistentitem: 'PersistentItem',
  person: 'Person',
  physicallocativestatus: 'PhysicalLocativeStatus',
  place: 'Place',
  production: 'Production',
  promissoryagreement: 'PromissoryAgreement',
  promissorystatus: 'PromissoryStatus',
  purchase: 'Purchase',
  socialrelationstatus: 'SocialRelationStatus',
  speechact: 'SpeechAct',
  symbolicact: 'SymbolicAct',
  timespan: 'TimeSpan',
  transformation: 'Transformation',
  voyage: 'Voyage',
};

// The keys of annotation tokens. An annotation is indexed as `key:value` tokens inside annotatedText,
// not as separate fields, so `placeId:GLOB_574` is looked up as one exact token.
const annotationTokenKeys = ['type', 'personId', 'placeId'];

export function isAnnotationToken(field: string): boolean {
  return annotationTokenKeys.includes(field);
}

export function toAnnotationType(name: string): string | undefined {
  const key = name.toLowerCase();
  return Object.hasOwn(annotationTypeFields, key) ? annotationTypeFields[key] : undefined;
}
