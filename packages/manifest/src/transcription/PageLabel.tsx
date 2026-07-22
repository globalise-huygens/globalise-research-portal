import './PageLabel.css';

type Props = {
  label: string | number;
  isCurrent?: boolean;
};

export function PageLabel({ label, isCurrent = false }: Props) {
  return (
    <span
      className="page-label"
      data-current={isCurrent ? 'true' : 'false'}
    >
      <span className="prefix">
        {isCurrent ? 'Current page' : 'Page'}
      </span>
      {label}
    </span>
  );
}
