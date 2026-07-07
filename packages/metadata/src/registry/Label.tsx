export type EntryLabelProps = { label: string };

export function Label({ label }: EntryLabelProps) {
  return <span className="label" >{label}: </span>;
}