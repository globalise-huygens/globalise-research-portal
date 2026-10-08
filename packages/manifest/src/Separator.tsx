type Props = {
  isBoundary: boolean;
};

export function Separator({ isBoundary }: Props) {
  return <span className="separator" data-boundary={isBoundary ? 'true' : undefined}>|</span>;
}
