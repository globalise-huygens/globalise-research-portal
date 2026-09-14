import { mergePaths, type TreeNode } from '@globalise/common';
import { ConceptNode, ConceptNodeRow } from './ConceptNode.tsx';
import type { SkosConcept } from './SkosModel.ts';

type ConceptHierarchyProps = {
  concept: SkosConcept;
  onSelect: (concept: SkosConcept) => void;
};

type HierarchyNode = {
  concept: SkosConcept;
  children: HierarchyNode[];
  isCurrent?: boolean;
  isScheme?: boolean;
  isTopConcept?: boolean;
};

export function ConceptHierarchy({
  concept,
  onSelect,
}: ConceptHierarchyProps) {
  if (
    !concept.inScheme?.length
    && !concept.broader?.length
    && !concept.narrower?.length
    && !concept.topConceptOf?.length
  ) {
    return null;
  }

  const hierarchy = buildHierarchy(concept);

  return (
    <ul className="concept-list hierarchy-paths">
      {hierarchy.map((node) => (
        <HierarchyConceptNode
          key={node.concept.id}
          node={node}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

type PathGroup = { scheme?: SkosConcept; paths: SkosConcept[][] };

function buildHierarchy(concept: SkosConcept): HierarchyNode[] {
  const paths = getBroaderPaths(concept);
  const groups: PathGroup[] = [];
  const schemeGroups = new Map<string, PathGroup>();
  let rootGroup: PathGroup | undefined;

  for (const path of paths) {
    const root = path[0];
    const rootSchemes = root.topConceptOf?.length
      ? root.topConceptOf
      : paths.length === 1
        ? concept.inScheme ?? []
        : [];

    if (!rootSchemes.length) {
      if (!rootGroup) {
        rootGroup = { paths: [] };
        groups.push(rootGroup);
      }
      rootGroup.paths.push(path);
      continue;
    }

    for (const scheme of rootSchemes) {
      let schemeGroup = schemeGroups.get(scheme.id);
      if (!schemeGroup) {
        schemeGroup = { scheme, paths: [] };
        schemeGroups.set(scheme.id, schemeGroup);
        groups.push(schemeGroup);
      }
      schemeGroup.paths.push(path);
    }
  }

  return groups.flatMap(({ scheme, paths }) => {
    const children = mergePaths(paths, (candidate) => candidate.id)
      .map((node) => toHierarchyNode(node, concept, true));

    return scheme
      ? [{ concept: scheme, children, isScheme: true }]
      : children;
  });
}

function toHierarchyNode(
  node: TreeNode<SkosConcept>,
  concept: SkosConcept,
  isRoot: boolean,
): HierarchyNode {
  return {
    concept: node.item,
    children: node.children.map((child) =>
      toHierarchyNode(child, concept, false)),
    isCurrent: node.item.id === concept.id,
    isTopConcept: isRoot && Boolean(node.item.topConceptOf?.length),
  };
}

function getBroaderPaths(concept: SkosConcept): SkosConcept[][] {
  if (!concept.broader?.length) {
    return [[concept]];
  }

  return concept.broader.flatMap((broader) =>
    getBroaderPaths(broader).map((path) => [...path, concept]));
}

type HierarchyConceptNodeProps = {
  node: HierarchyNode;
  onSelect: (concept: SkosConcept) => void;
};

function HierarchyConceptNode({
  node,
  onSelect,
}: HierarchyConceptNodeProps) {
  const narrower = node.isCurrent ? node.concept.narrower : undefined;
  const hasChildren = node.children.length || narrower?.length;

  return (
    <li className="concept-node">
      <ConceptNodeRow
        concept={node.concept}
        isCurrent={node.isCurrent}
        isScheme={node.isScheme}
        isTopConcept={node.isTopConcept}
        onSelect={onSelect}
      />
      {!!hasChildren && (
        <ul className="concept-list">
          {node.children.map((child) => (
            <HierarchyConceptNode
              key={child.concept.id}
              node={child}
              onSelect={onSelect}
            />
          ))}
          {narrower?.map((child) => (
            <ConceptNode
              key={child.id}
              concept={child}
              childKey="narrower"
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
