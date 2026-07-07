import { MetadataWithComponent, MatchRule, MetadataNode, defaultTarget } from './MetadataModel';
import { matchRule } from './matchRule.ts';

export function toMetadataWithComponent(
  node: MetadataNode,
  rules: MatchRule[],
): MetadataWithComponent {
  const { component, label } = matchRule(node, rules) ?? defaultTarget;
  const children = node.children.map(
    (child) => toMetadataWithComponent(child, rules),
  );
  const metadata = label
    ? { ...node, label }
    : node;
  return { metadata, component, children };
}