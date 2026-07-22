import './TranscriptionPlaceholder.css';

export type PlaceholderProps = {
  color?: string;
  background?: string;
  children?: React.ReactNode;
};

export function TranscriptionPlaceholder(
  { color, background, children }: PlaceholderProps,
) {
  return (
    <div
      className="transcription-placeholder"
      style={{ background, color }}
    >
      {children}
    </div>
  );
}
