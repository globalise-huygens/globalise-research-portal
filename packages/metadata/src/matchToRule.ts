import {
  MatchRule,
  MatchTarget,
  MetadataNode,
} from './MetadataModel';

export function matchToRule(
  entry: MetadataNode,
  rules: MatchRule[],
): MatchTarget | undefined {
  const found = rules.find(
    (rule) => rule.tags.some((m) => entry.tags.includes(m)),
  );
  return found?.target;
}