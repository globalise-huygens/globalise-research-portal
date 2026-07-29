import { ObjectCardSection } from '@globalise/design';
import { LangValue } from './SkosModel.ts';

type ReferenceProps = { title: string; value?: LangValue };

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
