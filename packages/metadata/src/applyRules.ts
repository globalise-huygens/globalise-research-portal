import { MetadataWithComponent, MatchRule, MetadataNode } from './MetadataModel';
import { matchRule } from './matchRule.ts';

export function applyRules(
  entries: MetadataNode[],
  rules: MatchRule[],
): MetadataWithComponent[] {
  return entries.map((entry) => {
    const match = matchRule(entry, rules);
    return {
      metadata: match?.label ? { ...entry, label: match.label } : entry,
      component: match?.component ?? 'default',
      children: applyRules(entry.children, rules),
    };
  });
}