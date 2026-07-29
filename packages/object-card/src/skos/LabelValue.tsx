import { HtmlValue } from './HtmlValue.tsx';
import { LangValue } from './SkosModel.ts';

export type LabelValueProps = {
  value: LangValue
};

export function LabelValue({ value }: LabelValueProps) {
  return <>
    <strong>{value['@language']}</strong>: <HtmlValue value={value['@value']}/>
  </>;
}