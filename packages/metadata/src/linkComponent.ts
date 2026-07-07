import { MetadataWithComponent, MatchRule, MetadataNode, defaultTarget } from './MetadataModel';
import { matchToRule } from './matchToRule.ts';

export function linkComponent(
  node: MetadataNode,
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