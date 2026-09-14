import {
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
} from '@globalise/design';
import { SkosValue } from './SkosModel.ts';
import { HtmlValue } from './HtmlValue.tsx';

type LabelListProps = { title: string; values?: SkosValue[] };

export function LabelList({ title, values }: LabelListProps) {
  if (!values?.length) {
    return null;
  }
  return (
    <ObjectCardSection title={title}>
      <ObjectCardPropertyList>
        {values.map((value, i) => (
          <ObjectCardProperty
            key={i}
            label={value['@language']}
            value={<HtmlValue value={value['@value']}/>}
          />
        ))}
      </ObjectCardPropertyList>
    </ObjectCardSection>
  );
}