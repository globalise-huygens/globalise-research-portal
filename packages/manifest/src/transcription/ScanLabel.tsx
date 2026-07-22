import './ScanLabel.css';

type Props = {
  number: string;
  isCurrent?: boolean;
};

export function ScanLabel({ number, isCurrent = false }: Props) {
  return (
    <span
      className="scan-label"
      data-current={isCurrent ? 'true' : 'false'}
    >
      <span className="prefix">Scan</span>
      {number}
    </span>
  );
}
