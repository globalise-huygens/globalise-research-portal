import { asArray } from '../util/asArray.ts';

export type LangValue = {
  '@language': string;
  '@value': string;
};

export type TypedValue = {
  type: string;
  '@value': string;
};

/**
 * Linked art literals come in four shapes:
 * a plain string, a language tagged value, a typed value,
 * or an array containing any mix of those.
 */
export type Literal = string | LangValue | TypedValue;

/**
 * Language preference, most preferred first.
 * Values without a language are always eligible.
 */
const languages = ['en', 'nl'];

export function isLangValue(value: unknown): value is LangValue {
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

/**
 * All string values of a literal, in document order.
 */
export function getLiterals(value: unknown): string[] {
  return asArray(value as Literal | Literal[] | undefined)
    .map(getStringValue)
    .filter((found) => !!found);
}

/**
 * The single most preferred string value of a literal.
 */
export function getLiteral(value: unknown): string {
  const values = asArray(value as Literal | Literal[] | undefined);
  for (const language of languages) {
    const found = values.find((it) => isLangValue(it) && it['@language'] === language);
    if (found) {
      return getStringValue(found);
    }
  }
  const untagged = values.find((it) => !isLangValue(it));
  return getStringValue(untagged ?? values[0]);
}

function getStringValue(value?: Literal): string {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return value['@value'] ?? '';
}
