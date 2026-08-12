import DOMPurify from 'dompurify';

type HtmlValueProps = {
  value: string
};

export function HtmlValue({ value }: HtmlValueProps) {
  const sanitized = DOMPurify.sanitize(value);
  return <span
    dangerouslySetInnerHTML={{ __html: sanitized }}
    style={{ whiteSpace: 'pre-line' }}
  ></span>;
}