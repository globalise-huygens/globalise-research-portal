import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt('zero', {
  breaks: true,
  html: false,
  linkify: false,
});

markdown.enable(['emphasis', 'newline']);
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
    ALLOWED_TAGS: ['em', 'br'],
    ALLOWED_ATTR: [],
  });
  return <span dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
