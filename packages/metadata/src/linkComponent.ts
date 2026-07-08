import { MetadataWithComponent, MatchRule, MetadataEntry, defaultTarget } from './MetadataModel';
import { matchToRule } from './matchToRule.ts';

export function linkComponent(
  node: MetadataEntry,
  rules: MatchRule[],
): MetadataWithComponent {
  const { component, label } = matchToRule(node, rules) ?? defaultTarget;
  const children = node.children.map(
    (child) => linkComponent(child, rules),
  );
  const metadata = label
    ? { ...node, label }
    : node;
  return { metadata, component, children };
}