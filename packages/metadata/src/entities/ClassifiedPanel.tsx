import { EntityIcon } from '@globalise/design';
import type { NerCategory, NerCategoryGroup } from './EntityPanelModel.ts';
import { PanelMessage } from './PanelMessage.tsx';
import { useClassifiedPanel } from './useClassifiedPanel.ts';
import { countTotal, hasSubcategories } from './toNerCategoryGroups.ts';

export function ClassifiedPanel() {
  const panelData = useClassifiedPanel();

  if (panelData.status !== 'ready') {
    return <PanelMessage status={panelData.status}/>;
  }

  return (
    <div className="metadata-panel entity-panel">
      <ul>
        {panelData.data.map((group) => (
          <NerCategoryGroupItem key={group.id} group={group}/>
        ))}
      </ul>
    </div>
  );
}

type NerCategoryGroupItemProps = {
  group: NerCategoryGroup;
};

function NerCategoryGroupItem({ group }: NerCategoryGroupItemProps) {
  const total = countTotal(group);
  const groupLabel = group.label.toLowerCase();
  const title = `The current document refers to ${total} ${groupLabel}`;

  return (
    <li>
      <span title={title}>
        <EntityIcon type={group.tagType} className="icon"/>{' '}
        {group.label} ({total})
      </span>
      {hasSubcategories(group) && (
        <ul>
          {group.nerCategories.map((nerCategory) => (
            <NerCategoryItem
              key={nerCategory.id}
              nerCategory={nerCategory}
              groupLabel={groupLabel}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

type NerCategoryItemProps = {
  nerCategory: NerCategory;
  groupLabel: string;
};

function NerCategoryItem({ nerCategory, groupLabel }: NerCategoryItemProps) {
  const { label, total } = nerCategory;
  const title = `${total} ${groupLabel} referred to ${label.toLowerCase()}`;

  return <li title={title}>{label} ({total})</li>;
}
