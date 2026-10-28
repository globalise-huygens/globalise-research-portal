import {
  findByPath,
  getContent,
  getValue,
  getValues,
  type LinkedArtNode,
} from '@globalise/common';
import { isInternalUri } from '../isInternalUri.ts';
import { getPersonNameRecords, sortPersonNames } from './PersonStatusModel.ts';

/**
 * Choose a readable name or label from the entity data already available.
 * If no readable text is available, use a placeholder such as "Person" or
 * "Vocabulary term".
 */
export function getRelationValue(node: LinkedArtNode): string {
  const names = findByPath(node, ['identified_by']).filter((name) => name.type === 'Name');
  const preferredNames = names.filter((name) => findByPath(name, ['classified_as'])
    .some((type) => type.id === 'http://vocab.getty.edu/aat/300404670'
      || node.type === 'LinguisticObject' && type.id === 'http://vocab.getty.edu/aat/300417193'));
  const candidates = preferredNames.length ? preferredNames : names;
  const preferredName = ['en', 'nl'].map((language) => candidates.find((name) =>
    findByPath(name, ['language']).some((value) => value.id?.endsWith(`/${language}`)),
  )).find(Boolean) ?? candidates[0];
  const appellation = sortPersonNames(getPersonNameRecords(node))[0]?.name;
  const labels = getValues(node._label);
  // An embedded vocabulary label list contains variants, not a preferred term.
  const label = node.type === 'Type' && labels.length > 1
    ? undefined
    : getValue(node._label);
  return [
    getValue(node.prefLabel),
    getValue(node.label),
    preferredName && getContent(preferredName),
    getContent(node),
    getValue(node.value),
    appellation,
    label && !isInternalUri(label) && !label.startsWith('_:') && !label.startsWith('vocop_obs_')
      && !/^(?:Person Identified by )?Person_\d+$/i.test(label)
      ? label : undefined,
    node.id && !isInternalUri(node.id) && !node.id.startsWith('_:') ? node.id : undefined,
    node.type === 'Type' ? 'Vocabulary term' : typeof node.type === 'string' ? node.type : 'Resource',
  ].find((value) => !!value)?.trim() ?? '';
}
