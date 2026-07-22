import { LangValue } from './ObjectCardModel.ts';

type ReferenceBlockProps = { title: string; value?: LangValue };

export function Reference({ title, value }: ReferenceBlockProps) {
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