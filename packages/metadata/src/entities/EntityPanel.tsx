import { Pair } from '../common';
import { useEntityPanel } from './useEntityPanel.ts';
import { countMentions, hasSubcategories } from './toNerCategoryGroups.ts';

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
            {entity.label}, {entity.type.toLowerCase()} ({entity.mentions.length})
          </li>
        ))}
      </ul>
      <h3>Entity tags</h3>
      <ul>
        {nerCategoryGroups.map((group) => (
          <li key={group.id}>
            <span title={`The current document refers to ${countMentions(group)} ${group.label.toLowerCase()}`}>
              {group.label} ({countMentions(group)})
            </span>
            {hasSubcategories(group) && (
              <ul>
                {group.nerCategories.map((nerCategory) => (
                  <li key={nerCategory.id} title={`${nerCategory.mentions.length} ${group.label.toLowerCase()} referred to ${nerCategory.label.toLowerCase()}`}>
                    {nerCategory.label} ({nerCategory.mentions.length})
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
