export type PlaceholderProps = {
  color?: string;
  background?: string;
  children?: React.ReactNode;
};

export function TranscriptionPlaceholder(
  { color, background, children }: PlaceholderProps,
) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: background ?? '#f8f8f8',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '5rem 1rem',
      color: color ?? 'grey',
      position: 'relative',
    }}>
      {children}
    </div>
  );
}