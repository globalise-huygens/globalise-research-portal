import { MetadataWithComponent, MatchRule, MetadataEntry } from './MetadataModel';
import { matchToRule } from './matchToRule.ts';

export function applyRules(
  entries: MetadataEntry[],
  rules: MatchRule[],
): MetadataWithComponent[] {
  return entries.map((entry) => {
    const match = matchToRule(entry, rules);
    return {
      metadata: match?.label ? { ...entry, label: match.label } : entry,
      component: match?.component ?? 'default',
      children: applyRules(entry.children, rules),
    };
  });
}