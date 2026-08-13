import { ObjectCardSection } from '@globalise/design';
import { SkosValue } from './SkosModel.ts';

type ReferenceProps = { title: string; value?: SkosValue };

export function Reference({ title, value }: ReferenceProps) {
  if (!value) {
    return <ObjectCardSection title={title} className="inactive"/>;
  }
  return (
    <ObjectCardSection title={title}>
      <p>{value['@value']}</p>
    </ObjectCardSection>
  );
}
