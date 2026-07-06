import { CategoryView } from './MetadataModel';
import { componentRegistry } from './registry/componentRegistry.ts';

type MetadataSectionProps = {
  categorViews: CategoryView[]
};

export function MetadataSection(
  { categorViews }: MetadataSectionProps,
) {
  return (
    <>
      {categorViews.map((categoryView, ci) => (
        <section key={ci} className="metadata-category">
          <h3>{categoryView.categoryName}</h3>
          <ul className="metadata">
            {categoryView.items.map((item, i) => {
              const Component = componentRegistry[item.componentName]
                ?? componentRegistry.default;
              return <Component key={i} entry={item.entry} />;
            })}
          </ul>
        </section>
      ))}
    </>
  );
}