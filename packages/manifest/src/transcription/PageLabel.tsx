type Props = { label: string | number };

export function PageLabel({label}: Props) {
  return <span style={{
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    color: '#999',
    fontSize: '0.8rem',
  }}>
    {label}
  </span>
}