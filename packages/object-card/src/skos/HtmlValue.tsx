import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt('zero', {
  breaks: true,
  html: false,
  linkify: true,
});

markdown.enable(['emphasis', 'linkify', 'newline']);
markdown.renderer.rules.strong_open = () => '';
markdown.renderer.rules.strong_close = () => '';

type HtmlValueProps = {
  value: string;
};

export function renderMarkdown(value: string): string {
  return markdown.renderInline(value);
}

export function HtmlValue({ value }: HtmlValueProps) {
  const sanitized = DOMPurify.sanitize(renderMarkdown(value), {
    ALLOWED_TAGS: ['a', 'em', 'br'],
    ALLOWED_ATTR: ['href'],
  });
  return <span dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
