export type EntryLabelProps = { label: string };

export function Label({ label }: EntryLabelProps) {
  return <span className="label" style={{ color: 'grey' }}>{label}: </span>;
}