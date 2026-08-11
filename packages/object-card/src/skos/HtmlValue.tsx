import './HtmlValue.css';
import { IconExternalLink } from '@globalise/design';
import DOMPurify from 'dompurify';

type HtmlValueProps = {
  value: string;
};

const URL_PATTERN = /(https?:\/\/[^\s<>"]*[^\s<>",'.,;:!?])/gi;

function normalizeText(value: string): string {
  return value
    .replace(/(\*\*|__)([^\n]+?)\1/g, '$2')
    .replace(/(^|[\s(])\*(?!\s)([^*\n]+?)\*(?!\*)/g, '$1$2')
    .replace(/(^|[\s(])_(?!\s)([^_\n]+?)_(?!_)/g, '$1$2');
}

export function HtmlValue({ value }: HtmlValueProps) {
  const sanitized = DOMPurify.sanitize(normalizeText(value));

  // Keep sanitized HTML intact. Plain text is handled separately so URLs can
  // become links without rewriting URLs that are already HTML attributes.
  if (/<[a-z][\s\S]*>/i.test(sanitized)) {
    return (
      <span
        className="html-value"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  const parts = sanitized.split(URL_PATTERN);

  return (
    <span className="html-value">
      {parts.map((part, index) =>
        /^https?:\/\//i.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            <span className="inline-link-label">{part}</span>
            <IconExternalLink aria-hidden="true" className="inline-link-icon" />
          </a>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </span>
  );
}
