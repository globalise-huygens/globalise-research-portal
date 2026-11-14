import type { AutocompleteConfig } from './SearchFieldConfig';

export type EntityToken = {
  type: string;
  id: string;
  label: string;
};

const entityTokenPattern = String.raw`@\{([^|}]+)\|([^|}]+)\|([^}]+)\}`;
export const entityTokenExactRegex = new RegExp(`^${entityTokenPattern}$`);
export const entityTokenRegex = new RegExp(entityTokenPattern, 'g');

export function encodeEntityToken<E extends object>(entity: E, config: AutocompleteConfig<E>): string {
  const type = encodeURIComponent(getValue(entity, config.type));
  const id = encodeURIComponent(getValue(entity, config.id));
  const label = encodeURIComponent(getValue(entity, config.label));

  return `@{${type}|${id}|${label}}`;
}

export function decodeEntityToken(token: string): EntityToken | null {
  const match = entityTokenExactRegex.exec(token);
  if (!match)
  {return null;}

  try {
    return {
      type: decodeURIComponent(match[1]),
      id: decodeURIComponent(match[2]),
      label: decodeURIComponent(match[3]),
    };
  } catch {
    return null;
  }
}

export function entityTokensToLabels(text: string): string {
  return text.replace(entityTokenRegex, (token) => decodeEntityToken(token)?.label ?? token);
}

export function getValue<E extends object>(entity: E, property: keyof E | ((entity: E) => string)): string {
  return typeof property === 'function'
    ? property(entity)
    : String(entity[property]);
}
