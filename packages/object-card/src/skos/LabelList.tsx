import { LangValue } from './SkosModel.ts';
import { LabelValue } from './LabelValue.tsx';

type LabelListProps = { title: string; values?: LangValue[] };

export function LabelList({ title, values }: LabelListProps) {
  if (!values?.length) {
    return <h2 title="No data" className="inactive">{title}</h2>;
  }
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {values.map((value, i) => (
          <li key={i}>
            <LabelValue value={value}/>
          </li>
        ))}
      </ul>
    </>
  );
}