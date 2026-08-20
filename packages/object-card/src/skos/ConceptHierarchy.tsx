import { ConceptNodeRow } from './ConceptNode.tsx';
import type { SkosConcept } from './SkosModel.ts';

type ConceptHierarchyProps = {
  concept: SkosConcept;
  onSelect: (concept: SkosConcept) => void;
};

type HierarchyNode = {
  concept: SkosConcept;
  children: HierarchyNode[];
  isCurrent?: boolean;
};

type HierarchyPath = {
  root: HierarchyNode;
  scheme?: SkosConcept;
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

  const currentNode: HierarchyNode = {
    concept,
    children: concept.narrower?.map(buildNarrowerNode) ?? [],
    isCurrent: true,
  };
  const roots = addBroaderNodes(concept, currentNode);
  const paths = roots.flatMap<HierarchyPath>((root) => {
    const schemes = root.concept.topConceptOf?.length
      ? root.concept.topConceptOf
      : roots.length === 1
        ? concept.inScheme ?? []
        : [];

    return schemes.length
      ? schemes.map((scheme) => ({ root, scheme }))
      : [{ root, scheme: undefined }];
  });

  return (
    <div className="hierarchy-paths">
      {paths.map(({ root, scheme }, index) => (
        <HierarchyPath
          key={`${root.concept.id}-${scheme?.id ?? index}`}
          root={root}
          scheme={scheme}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

type HierarchyPathProps = HierarchyPath & {
  onSelect: (concept: SkosConcept) => void;
};

function HierarchyPath({ root, scheme, onSelect }: HierarchyPathProps) {
  const hierarchy = (
    <HierarchyConceptNode
      isTopConcept={Boolean(root.concept.topConceptOf?.length)}
      node={root}
      onSelect={onSelect}
    />
  );

  return (
    <ul className="concept-list">
      {scheme ? (
        <li className="concept-node">
          <ConceptNodeRow concept={scheme} isScheme onSelect={onSelect} />
          <ul className="concept-list">
            {hierarchy}
          </ul>
        </li>
      ) : (
        hierarchy
      )}
    </ul>
  );
}

function buildNarrowerNode(concept: SkosConcept): HierarchyNode {
  return {
    concept,
    children: concept.narrower?.map(buildNarrowerNode) ?? [],
  };
}

function addBroaderNodes(
  concept: SkosConcept,
  descendant: HierarchyNode,
): HierarchyNode[] {
  if (!concept.broader?.length) {
    return [descendant];
  }

  return concept.broader.flatMap((broader) => addBroaderNodes(broader, {
    concept: broader,
    children: [descendant],
  }));
}

type HierarchyConceptNodeProps = {
  isTopConcept?: boolean;
  node: HierarchyNode;
  onSelect: (concept: SkosConcept) => void;
};

function HierarchyConceptNode({
  isTopConcept,
  node,
  onSelect,
}: HierarchyConceptNodeProps) {
  return (
    <li className="concept-node">
      <ConceptNodeRow
        concept={node.concept}
        isCurrent={node.isCurrent}
        isTopConcept={isTopConcept}
        onSelect={onSelect}
      />
      {!!node.children.length && (
        <ul className="concept-list">
          {node.children.map((child) => (
            <HierarchyConceptNode
              key={child.concept.id}
              node={child}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
