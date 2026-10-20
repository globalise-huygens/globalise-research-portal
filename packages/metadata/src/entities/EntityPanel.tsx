import { getEntityTagType, getObjectCardHref } from '@globalise/common';
import { EntityIcon, EntityTag } from '@globalise/design';
import { Pair } from '../common';
import { useEntityPanel } from './useEntityPanel.ts';
import { countTotal, hasSubcategories } from './toNerCategoryGroups.ts';

export function EntityPanel() {
  const { document, linkedEntities, nerCategoryGroups } = useEntityPanel();

  if (!document) {
    return <div className="toc-empty">No document on this scan.</div>;
  }

  return (
    <div className="metadata-panel entity-panel">
      <dl className="document">
        <Pair label="Document">{document.label}</Pair>
      </dl>
      <h3>Linked entities</h3>
      <ul>
        {linkedEntities.map((entity) => (
          <li key={entity.id} title={`The current document refers to ${entity.label} ${entity.mentions.length} times`}>
            <EntityTag type={getEntityTagType(entity.type)} href={getObjectCardHref(entity.id)}>{entity.label}</EntityTag> ({entity.mentions.length})
          </li>
        ))}
      </ul>
      <h3>Entity tags</h3>
      <ul>
        {nerCategoryGroups.map((group) => {
          const groupTotal = countTotal(group);
          return (
            <li key={group.id}>
              <span title={groupTotal === undefined ? undefined : `The current document refers to ${groupTotal} ${group.label.toLowerCase()}`}>
                <EntityIcon type={group.tagType} className="icon"/>{' '}
                {group.label} ({toCountLabel(groupTotal)})
              </span>
              {hasSubcategories(group) && (
                <ul>
                  {group.nerCategories.map(({ id, label, total }) => (
                    <li key={id} title={total === undefined ? undefined : `${total} ${group.label.toLowerCase()} referred to ${label.toLowerCase()}`}>
                      {label} ({toCountLabel(total)})
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function toCountLabel(total?: number): string {
  return total === undefined ? 'count unavailable' : `${total}`;
}
