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

function buildHierarchy(concept: SkosConcept): HierarchyNode[] {
  const paths = getBroaderPaths(concept);
  const hierarchy: HierarchyNode[] = [];
  const schemeNodes = new Map<string, HierarchyNode>();

  for (const path of paths) {
    const root = path[0];
    const rootSchemes = root.topConceptOf?.length
      ? root.topConceptOf
      : paths.length === 1
        ? concept.inScheme ?? []
        : [];

    if (!rootSchemes.length) {
      addHierarchyPath(hierarchy, path);
      continue;
    }

    for (const scheme of rootSchemes) {
      let schemeNode = schemeNodes.get(scheme.id);
      if (!schemeNode) {
        schemeNode = { concept: scheme, children: [], isScheme: true };
        schemeNodes.set(scheme.id, schemeNode);
        hierarchy.push(schemeNode);
      }
      addHierarchyPath(schemeNode.children, path);
    }
  }

  return hierarchy;
}

function getBroaderPaths(concept: SkosConcept): SkosConcept[][] {
  if (!concept.broader?.length) {
    return [[concept]];
  }

  return concept.broader.flatMap((broader) =>
    getBroaderPaths(broader).map((path) => [...path, concept]));
}

function addHierarchyPath(
  nodes: HierarchyNode[],
  path: SkosConcept[],
  index = 0,
) {
  const concept = path[index];
  let node = nodes.find((candidate) => candidate.concept.id === concept.id);

  if (!node) {
    node = {
      concept,
      children: [],
      isTopConcept: index === 0 && Boolean(concept.topConceptOf?.length),
    };
    nodes.push(node);
  }

  if (index === path.length - 1) {
    node.isCurrent = true;
  } else {
    addHierarchyPath(node.children, path, index + 1);
  }
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
