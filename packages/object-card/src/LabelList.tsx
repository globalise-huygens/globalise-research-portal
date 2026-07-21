import { LangValue } from './ObjectCardModel.ts';

type LabelListProps = { title: string; values?: LangValue[] };

export function LabelList({ title, values }: LabelListProps) {
  if (!values?.length) {
    return <h2 className="inactive">{title}</h2>;
  }
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {values.map((value) => (
          <li key={`${value['@language']}-${value['@value']}`}>
            <strong>{value['@language']}</strong>: {value['@value']}
          </li>
        ))}
      </ul>
    </>
  );
}