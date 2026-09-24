type Props = {
  isEdge: boolean;
};

export function Separator({ isEdge }: Props) {
  return <span className="separator" data-edge={isEdge ? 'true' : undefined}>|</span>;
}
