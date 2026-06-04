export type PlaceholderProps = {
  width: number;
  height: number;
  color?: string;
  background?: string;
  children?: React.ReactNode;
};

export function TranscriptionPlaceholder(
  {width, height, color, background, children}: PlaceholderProps
) {
  return (
    <div style={{
      width,
      height,
      background: background ?? '#f8f8f8',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '5rem',
      color: color ?? 'grey',
      position: 'relative',
    }}>
      {children}
    </div>
  );
}