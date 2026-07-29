import { LangValue } from './SkosModel.ts';

type ReferenceProps = { title: string; value?: LangValue };

export function Reference({ title, value }: ReferenceProps) {
  if (!value) {
    return <h2 title="No data" className="inactive">{title}</h2>;
  }
  return (
    <>
      <h2>{title}</h2>
      <p>{value['@value']}</p>
    </>
  );
}