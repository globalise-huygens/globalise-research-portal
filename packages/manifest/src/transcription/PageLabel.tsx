import './TranscriptionPage.css';

type Props = {
  label: string | number;
  isCurrent?: boolean;
};

export function PageLabel({ label, isCurrent = false }: Props) {
  return (
    <span
      className="manifest-transcription-page__label"
      data-current={isCurrent ? 'true' : 'false'}
    >
      <span className="manifest-transcription-page__label-prefix">
        {isCurrent ? 'Current page' : 'Page'}
      </span>
      {label}
    </span>
  );
}
