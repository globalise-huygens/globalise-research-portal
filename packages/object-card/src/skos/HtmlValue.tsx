import { IconExternalLink } from '@globalise/design';
import DOMPurify from 'dompurify';

type HtmlValueProps = {
  value: string;
};

const URL_PATTERN = /(https?:\/\/[^\s<>"']*[^\s<>"'.,;:!?])/gi;

function renderMarkdownLite(value: string): string {
  return value
    .replace(/(\*\*|__)([^\n]+?)\1/g, '<strong>$2</strong>')
    .replace(/(^|[\s(])\*(?!\s)([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])_(?!\s)([^_\n]+?)_(?!_)/g, '$1<em>$2</em>');
}

export function HtmlValue({ value }: HtmlValueProps) {
  const htmlValue = renderMarkdownLite(value);
  const parts = DOMPurify.sanitize(htmlValue).split(URL_PATTERN);

  return (
    <span className="concept-card__html-value">
      {parts.map((part, index) =>
        /^https?:\/\//i.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="concept-card__inline-link"
          >
            <span className="concept-card__inline-link-label">{part}</span>
            <IconExternalLink
              aria-hidden="true"
              className="concept-card__inline-link-icon"
            />
          </a>
        ) : (
          <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
        ),
      )}
    </span>
  );
}
