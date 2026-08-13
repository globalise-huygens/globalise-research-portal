import { asArray } from '../util/asArray.ts';

export type LanguageValue = {
  '@language': string;
  '@value': string;
};

export type TypedValue = {
  type: string;
  '@value': string;
};

export type LinkedArtValue = string | LanguageValue | TypedValue;

const languages = ['en', 'nl'];

export function isLanguageValue(value: unknown): value is LanguageValue {
  return !!value && typeof value === 'object' && '@language' in value;
}

export function isTypedValue(value: unknown): value is TypedValue {
  return (
    !!value
    && typeof value === 'object'
    && '@value' in value
    && !('@language' in value)
  );
}


export function getValues(value: unknown): string[] {
  return asArray(value as LinkedArtValue | LinkedArtValue[] | undefined)
    .map(getStringValue)
    .filter((found) => !!found);
}

export function getValue(value: unknown): string {
  const values = asArray(value as LinkedArtValue | LinkedArtValue[] | undefined);
  for (const language of languages) {
    const found = values.find(
      (it) => isLanguageValue(it) && it['@language'] === language,
    );
    if (found) {
      return getStringValue(found);
    }
  }
  const untagged = values.find((it) => !isLanguageValue(it));
  return getStringValue(untagged ?? values[0]);
}

function getStringValue(value?: LinkedArtValue): string {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return value['@value'] ?? '';
}
