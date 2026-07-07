import { CategoryView } from './MetadataModel';
import { RegistryComponent } from './registry';

type MetadataSectionProps = {
  categories: CategoryView[]
};

export function MetadataView(
  { categories }: MetadataSectionProps,
) {
  return (
    <>
      {categories.map((category, ci) => (
        <section key={ci} className="metadata-category">
          <h3>{category.category}</h3>
          <ul className="metadata">
            {category.metadata.map((entry, i) =>
              <RegistryComponent key={i} entry={entry} />)
            }
          </ul>
        </section>
      ))}
    </>
  );
}