import {
  MatchRule,
  MatchTarget,
  MetadataEntry,
} from './MetadataModel';

export function matchToRule(
  entry: MetadataEntry,
  rules: MatchRule[],
): MatchTarget | undefined {
  const found = rules.find(
    (rule) => rule.tags.some((m) => entry.tags.includes(m)),
  );
  return found?.target;
}