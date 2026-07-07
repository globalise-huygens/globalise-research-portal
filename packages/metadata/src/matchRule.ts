import {
  MatchRule,
  MatchTarget,
  MetadataNode,
} from './MetadataModel';
import { asArray } from './asArray.ts';

export function matchRule(
  entry: MetadataNode,
  rules: MatchRule[],
): MatchTarget | undefined {
  const { classifiedAs, propName } = entry.source;
  const found = rules.find((rule) => {
    const matchers = asArray(rule.sourceMatcher);
    return matchers.some((m) => m === classifiedAs || m === propName);
  });
  return found?.target;
}