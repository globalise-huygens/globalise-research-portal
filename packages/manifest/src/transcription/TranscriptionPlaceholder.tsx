import './TranscriptionPlaceholder.css';

export type PlaceholderProps = {
  tone?: 'default' | 'error';
  children?: React.ReactNode;
};

export function TranscriptionPlaceholder(
  { tone = 'default', children }: PlaceholderProps,
) {
  return (
    <div
      className="transcription-placeholder"
      data-tone={tone}
    >
      {children}
    </div>
  );
}
