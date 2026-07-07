import { MatchTarget, MetadataConfig, MetadataEntry } from './MetadataModel';
import { asArray } from './asArray.ts';

export function matchRule(
  entry: MetadataEntry,
  config: MetadataConfig,
): MatchTarget | undefined {
  const { classifiedAs, propName } = entry.source;
  const found = config.rules.find((rule) => {
    const matchers = asArray(rule.sourceMatcher);
    return matchers.some((m) => m === classifiedAs || m === propName);
  });
  return found?.target;
}